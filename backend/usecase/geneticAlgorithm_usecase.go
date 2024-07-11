package usecase

import (
	"encoding/json"
	"fmt"
	"gorm.io/datatypes"
	"gorm.io/gorm"
	"log"
	"math"
	"math/rand"
	"sort"
	"time"
	"utp-ga-2024/backend/domain"
	"utp-ga-2024/backend/sse"
)

// GeneticAlgorithm represents the genetic algorithm
type GeneticAlgorithm struct {
	AverageFitness     float64
	PastAverageFitness float64
	Running            bool
	Chromosomes        []*Chromosome
	Data               domain.DataSchedule
	TournamentSize     float64
	ElitePercent       float64
	LowVariety         int
	HighestFitness     float64
	LowestFitness      float64
	Elites             []*Chromosome
	MatingPool         [][]int
	Offsprings         []*Chromosome
	TempChromosome     *Chromosome
	TempSections       map[int][2][]int
	Settings           domain.Setting
	StopWhenMaxFitness float64
	MutationRate       float64
	MutationRateStep   float64
	ClientChan         chan string // Add this
	DB                 gorm.DB
	UniversityID       uint
	SemesterID         uint
}

// NewGeneticAlgorithm creates a new GeneticAlgorithm
func NewGeneticAlgorithm(data domain.DataSchedule, clientChan chan string, db gorm.DB, UniversityID uint, SemesterID uint, setting domain.Setting) *GeneticAlgorithm {
	settings := setting
	ga := &GeneticAlgorithm{
		Running:            true,
		Data:               data,
		TournamentSize:     0.04,
		ElitePercent:       0.05,
		LowVariety:         55,
		Settings:           settings,
		StopWhenMaxFitness: settings.MaximumFitness,
		MutationRate:       settings.MutationRateBase,
		MutationRateStep:   settings.MutationRateStep,
		ClientChan:         clientChan, // Initialize
		DB:                 db,
		UniversityID:       UniversityID,
		SemesterID:         SemesterID,
	}
	return ga
}

func (ga *GeneticAlgorithm) sendSignal(signalType domain.SignalType, data interface{}) {
	message := domain.WSMessage{
		Type: signalType,
		Data: data,
	}
	msg, _ := json.Marshal(message)
	sse.SendSSEMessage(string(signalType), msg)
}

// Initialization initializes the genetic algorithm
func (ga *GeneticAlgorithm) Initialization() {
	// Generate population based on minimum population
	ga.GenerateChromosome(ga.Settings.MinimumPopulation)
}

// GenerateChromosome generates a specified number of chromosomes
func (ga *GeneticAlgorithm) GenerateChromosome(quantity int) {
	ga.sendSignal(domain.ProgressBarSignal, 0)
	for i := 0; i < quantity; i++ {
		statusMessage := fmt.Sprintf("Creation #%d of %d quantity", i+1, quantity)
		ga.sendSignal(domain.StatusSignal, statusMessage)
		ga.sendSignal(domain.ProgressBarSignal, (i+1)*100/quantity)
		ga.TempChromosome = NewChromosome(ga.Data, ga.Settings)
		sections := make(map[int][]int)
		for key, value := range ga.Data.Semesters {
			courseIds := ConvertUintSliceToIntSlice(value.CourseIds)
			sections[key] = courseIds
		}
		ga.GenerateSubjectPlacementsForSections(sections)
		ga.Chromosomes = append(ga.Chromosomes, ga.TempChromosome)
	}
}

func (ga *GeneticAlgorithm) GenerateSubjectPlacementsForSections(sections map[int][]int) {
	//log.Println("Entered GenerateSubjectPlacementsForSections")
	maxSubjects := 0
	for _, subjects := range sections {
		if len(subjects) > maxSubjects {
			maxSubjects = len(subjects)
		}
	}

	for i := 0; i < maxSubjects; i++ {
		for section, subjectList := range sections {
			if len(subjectList) == 0 {
				continue
			}
			subjectToPlace := rand.Intn(len(subjectList))
			//log.Printf("Placing subject %d in section %d\n", subjectList[subjectToPlace], section)
			result := ga.GenerateSubjectPlacement([]int{section}, subjectList[subjectToPlace])
			if !result {
				ga.TempChromosome.Data.Unplaced[section] = append(ga.TempChromosome.Data.Unplaced[section], subjectList[subjectToPlace])
				//log.Printf("Could not place subject %d in section %d\n", subjectList[subjectToPlace], section)
			} else {
				//log.Printf("Successfully placed subject %d in section %d\n", subjectList[subjectToPlace], section)
			}

			// Log the current state before modification
			//log.Printf("Before modification - Section: %d, Subjects: %v, Subject to place: %d\n", section, subjectList, subjectToPlace)

			// Create a new slice to avoid modifying the existing slice reference
			newSubjectList := append(subjectList[:subjectToPlace], subjectList[subjectToPlace+1:]...)
			sections[section] = newSubjectList

			// Log the current state after modification
			//log.Printf("After modification - Section %d: %v\n", section, sections[section])
		}
	}
	//log.Println("Completed GenerateSubjectPlacementsForSections")
}

// GenerateSubjectPlacement generates a subject placement within a section
func (ga *GeneticAlgorithm) GenerateSubjectPlacement(section []int, subject int) bool {
	//log.Printf("Entering GenerateSubjectPlacement for sections: %v, subject: %d\n", section, subject)
	//defer log.Printf("Exiting GenerateSubjectPlacement for sections: %v, subject: %d\n", section, subject)

	generating := true
	generationAttempt := 0
	errorState := 0 // Initialize errorState to 0

	subjectDetails := ga.Data.Courses[subject]
	var room int
	var timeDetails []int
	var instructor int

	for generating {
		generationAttempt++
		//log.Printf("Generation attempt %d for subject %d in section %v\n with error %d", generationAttempt, subject, section, errorState)
		if generationAttempt > ga.Settings.GenerationTolerance {
			generating = false
			//log.Printf("Exceeded generation tolerance for subject %d in section %v\n", subject, section)
			return false
		}

		if errorState == 0 {
			var err error
			room, err = ga.SelectRoom(subject)
			if err != nil {
				//log.Printf("Error selecting room: %v\n", err)
				return false
			}
			//log.Printf("Selected room %d for subject %d\n", room, subject)

			if len(subjectDetails.InstructorIds) > 1 {
				instructor = ga.SelectInstructor(subject)
				//log.Printf("Selected instructor %d for subject %d\n", instructor, subject)
			} else if len(subjectDetails.InstructorIds) == 1 {
				instructor = int(subjectDetails.InstructorIds[0])
				//log.Printf("Single instructor %d for subject %d\n", instructor, subject)
			} else {
				instructor = 0
				//log.Printf("No instructor for subject %d\n", subject)
			}
			timeDetails = ga.SelectTimeDetails(subject)
			//log.Printf("Selected time details %v for subject %d\n", timeDetails, subject)
		} else {
			if errorState == 1 || errorState == 2 {
				if rand.Intn(2) == 0 {
					errorState = 3
					//log.Printf("Changing to time error state for subject %d\n", subject)
				} else if errorState == 1 {
					var err error
					room, err = ga.SelectRoom(subject)
					if err != nil {
						//log.Printf("Error selecting room: %v\n", err)
						return false
					}
					//log.Printf("Selected room %d for subject %d\n", room, subject)
				} else {
					if len(subjectDetails.InstructorIds) > 1 {
						instructor = ga.SelectInstructor(subject)
						//log.Printf("Selected new instructor %d for subject %d\n", instructor, subject)
					} else {
						errorState = 3
						//log.Printf("Switching to time error state for subject %d\n", subject)
					}
				}
			} else if errorState == 3 || errorState == 4 {
				timeDetails = ga.SelectTimeDetails(subject)
				//log.Printf("Selected new time details %v for subject %d\n", timeDetails, subject)
			}
		}

		scheduleToInsert := []int{room, section[0], subject, instructor, timeDetails[0], timeDetails[1], timeDetails[2]}
		errorState = ga.TempChromosome.InsertSchedule(scheduleToInsert)
		//log.Printf("Attempted to insert schedule %v for subject %d, errorState: %d\n", scheduleToInsert, subject, errorState)

		if errorState == 5 {
			//log.Printf("Successfully placed subject %d\n", subject)
			return true
		}
	}
	//log.Printf("Failed to place subject %d\n", subject)
	return false
}

func (ga *GeneticAlgorithm) SelectRoom(subject int) (int, error) {
	roomKeys := make([]int, 0, len(ga.Data.Rooms))
	for key := range ga.Data.Rooms {
		roomKeys = append(roomKeys, key)
	}

	maxAttempts := 2000 // Define a reasonable maximum number of attempts
	attempts := 0

	courseRegistrations := ga.Data.Courses[subject].NumOfRegistrations

	for {
		attempts++
		if attempts > maxAttempts {
			return -1, fmt.Errorf("could not find a suitable room for subject %d after %d attempts", subject, maxAttempts)
		}

		candidateIndex := rand.Intn(len(roomKeys))
		candidate := roomKeys[candidateIndex]
		room := ga.Data.Rooms[candidate]

		if ga.Data.Courses[subject].Type == room.Type && room.Size >= courseRegistrations {
			return candidate, nil
		}
	}
}

// SelectInstructor selects a random instructor for the given subject
func (ga *GeneticAlgorithm) SelectInstructor(subject int) int {
	subjectInstructors := ga.Data.Courses[subject].InstructorIds
	if len(subjectInstructors) == 0 {
		return 0
	}

	for {
		instructor := subjectInstructors[rand.Intn(len(subjectInstructors))]
		if instructor != 0 {
			return int(instructor)
		}
	}
}

func (ga *GeneticAlgorithm) SelectTimeDetails(subject int) []int {
	days := rand.Perm(5)
	hours := int(ga.Data.Courses[subject].Hours)
	selectedDay := days[0]
	var timeslots []string
	if err := json.Unmarshal(ga.Settings.Timeslots, &timeslots); err != nil {
		log.Printf("Error unmarshaling timeslots: %v", err)
	}

	startingTime := 0
	endingTime := len(timeslots)

	startingTimeslotStatus := false
	var startingTimeslot int

	for !startingTimeslotStatus {
		candidate := rand.Intn(endingTime-startingTime) + startingTime
		if candidate+hours <= endingTime {
			startingTimeslot = candidate
			startingTimeslotStatus = true
		}
	}

	return []int{selectedDay, startingTimeslot, hours}
}

// Evaluate evaluates the fitness of each chromosome
func (ga *GeneticAlgorithm) Evaluate() {
	totalChromosomeFitness := 0.0
	ga.PastAverageFitness = ga.AverageFitness
	ga.LowestFitness = 100.0
	ga.HighestFitness = 0.0

	for index, chromosome := range ga.Chromosomes {
		statusMessage := fmt.Sprintf("Chromosome evaluation #%d of %d", index+1, len(ga.Chromosomes))
		ga.sendSignal(domain.StatusSignal, statusMessage)
		ga.sendSignal(domain.ProgressBarSignal, (index+1)*100/len(ga.Chromosomes))
		chromosome.Fitness = ga.EvaluateAll(chromosome)
		totalChromosomeFitness += chromosome.Fitness
		ga.AverageFitness = totalChromosomeFitness / float64(len(ga.Chromosomes))
		if chromosome.Fitness > ga.HighestFitness {
			ga.HighestFitness = chromosome.Fitness
		}
		if chromosome.Fitness < ga.LowestFitness {
			ga.LowestFitness = chromosome.Fitness
		}

	}
	//log.Println("so luong", len(ga.Chromosomes))
	//log.Println("total", totalChromosomeFitness)
	//log.Println("ava", ga.AverageFitness)

	// Sort chromosomes by fitness
	chromosomeFitness := make([]struct {
		index   int
		fitness float64
	}, len(ga.Chromosomes))

	for i, chromosome := range ga.Chromosomes {
		chromosomeFitness[i] = struct {
			index   int
			fitness float64
		}{index: i, fitness: chromosome.Fitness}
	}

	sort.Slice(chromosomeFitness, func(i, j int) bool {
		return chromosomeFitness[i].fitness < chromosomeFitness[j].fitness
	})

	//send top 5 chromosomes to dataSignal
	topChromosomes := make([]interface{}, 5)
	for i := 0; i < 5 && i < len(chromosomeFitness); i++ {
		chromosome := ga.Chromosomes[chromosomeFitness[len(chromosomeFitness)-1-i].index]
		topChromosomes[i] = chromosome
	}

	ga.sendSignal(domain.DataSignal, topChromosomes)
}

// EvaluateAll calculates the overall fitness of a chromosome
func (ga *GeneticAlgorithm) EvaluateAll(chromosome *Chromosome) float64 {
	subjectPlacement := 0.0
	if ga.Settings.SubjectPlacement != 0 {
		subjectPlacement = ga.EvaluateSubjectPlacements(chromosome)
	}
	idleTime := 0.0
	if ga.Settings.IdleTime != 0 {
		idleTime = ga.EvaluateInstructorIdleTime(chromosome)
	}

	chromosome.FitnessDetails = []float64{subjectPlacement, idleTime}
	return subjectPlacement*float64(ga.Settings.SubjectPlacement)/100 + idleTime*float64(ga.Settings.IdleTime)/100
}

// EvaluateSubjectPlacements evaluates how well subjects are placed within sections
func (ga *GeneticAlgorithm) EvaluateSubjectPlacements(chromosome *Chromosome) float64 {
	sections := make(map[int][]int)
	for key, value := range ga.Data.Semesters {
		sections[key] = ConvertUintSliceToIntSlice(value.CourseIds)
	}

	//chromosomeUnplacedData := chromosome.Data.Unplaced

	lenChromosomeUnplacedData := 0
	lenChromosomePlacedData := 0

	// Iterate over all sections to gather placed and unplaced data
	for _, sectionDetails := range chromosome.Data.Semesters {
		chromosomePlacedData := sectionDetails.Details
		for _, details := range chromosomePlacedData {
			if len(details.Days) == 0 {
				lenChromosomeUnplacedData++
				continue
			}
			lenChromosomePlacedData++
		}

		// Add unplaced data for the current section
		//lenChromosomeUnplacedData += len(chromosomeUnplacedData[sectionID])
	}

	totalSubjects := 0
	for _, subjects := range sections {
		totalSubjects += len(subjects)
	}

	totalUnplacedSubjects := lenChromosomeUnplacedData
	return round(((float64(totalSubjects)-float64(totalUnplacedSubjects))/float64(totalSubjects))*100, 2)
}

// EvaluateInstructorIdleTime evaluates the idle time of instructors
func (ga *GeneticAlgorithm) EvaluateInstructorIdleTime(chromosome *Chromosome) float64 {
	instructorFitnesses := []float64{}
	for _, instructor := range chromosome.Data.Instructors {
		week := map[int][]*int{}
		for day := 0; day < 6; day++ {
			week[day] = []*int{}
		}
		for _, timeslotRow := range instructor {
			for day, value := range timeslotRow {
				week[day] = append(week[day], value)
			}
		}

		weekFitnesses := []float64{}
		for _, day := range week {
			dayFreeTimeslots := []*int{}
			for _, slot := range day {
				if slot == nil {
					dayFreeTimeslots = append(dayFreeTimeslots, slot)
				}
			}
			nFreeTimeslots := len(dayFreeTimeslots)
			nSubjects := countNonNil(day)
			if nSubjects > 0 {
				nDayGapslots := countGaps(day)
				dayFitness := ((float64(nFreeTimeslots) - float64(nDayGapslots)) / float64(nFreeTimeslots)) * 100
				weekFitnesses = append(weekFitnesses, dayFitness)
			}
		}
		if len(weekFitnesses) > 0 {
			instructorFitness := sum(weekFitnesses) / float64(len(weekFitnesses))
			instructorFitnesses = append(instructorFitnesses, instructorFitness)
		}
	}
	if len(instructorFitnesses) > 0 {
		return sum(instructorFitnesses) / float64(len(instructorFitnesses))
	}
	return 0.0
}

// Helper functions
func round(val float64, precision int) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}

func countNonNil(slice []*int) int {
	count := 0
	for _, v := range slice {
		if v != nil {
			count++
		}
	}
	return count
}

func countGaps(slice []*int) int {
	gaps := 0
	inGap := false
	for _, v := range slice {
		if v == nil {
			if inGap {
				gaps++
				inGap = false
			}
		} else {
			inGap = true
		}
	}
	return gaps
}

func sum(slice []float64) float64 {
	total := 0.0
	for _, v := range slice {
		total += v
	}
	return total
}

// Adapt adapts the population based on fitness deviation
func (ga *GeneticAlgorithm) Adapt() {
	sigmas, sigmaInstances := ga.GetFitnessDeviation()
	ga.AlignPopulation(sigmas, sigmaInstances)
	ga.AdjustMutationRate()
}

// GetFitnessDeviation calculates the deviation of fitness scores
func (ga *GeneticAlgorithm) GetFitnessDeviation() ([]int, map[int]float64) {
	populationCount := len(ga.Chromosomes)
	fitnesses := make([]float64, populationCount)
	for i, chromosome := range ga.Chromosomes {
		fitnesses[i] = chromosome.Fitness
	}
	mean := mean(fitnesses)
	sigmas := make([]int, populationCount)
	for i, fitness := range fitnesses {
		sigmas[i] = int(fitness - mean)
	}
	sigmaInstances := map[int]float64{}
	for _, sigma := range sigmas {
		sigmaInstances[sigma]++
	}
	for sigma, count := range sigmaInstances {
		sigmaInstances[sigma] = (count / float64(populationCount)) * 100
	}
	return sigmas, sigmaInstances
}

func mean(slice []float64) float64 {
	total := 0.0
	for _, v := range slice {
		total += v
	}
	return total / float64(len(slice))
}

// AlignPopulation adjusts the population size based on fitness deviation
func (ga *GeneticAlgorithm) AlignPopulation(sigmas []int, sigmaInstances map[int]float64) {
	populationCount := len(ga.Chromosomes)
	sigmaStartingInstance := sigmaInstances[sigmas[0]]
	//log.Println("Sigmas", sigmas)
	//log.Println("Sigma starting instance", sigmaStartingInstance)

	if sigmaStartingInstance > float64(ga.LowVariety) {
		generate := int((sigmaStartingInstance - float64(ga.LowVariety)) / 100 * float64(populationCount))
		for generate+populationCount > ga.Settings.MaximumPopulation {
			generate--
		}
		ga.GenerateChromosome(generate)
	} else {
		remove := int((float64(ga.LowVariety) - sigmaStartingInstance) / 100 * float64(populationCount))
		for populationCount-remove < ga.Settings.MinimumPopulation {
			remove--
		}
		removed := 0
		for i := 0; i < len(ga.Chromosomes); i++ {
			if removed < remove {
				ga.Chromosomes = append(ga.Chromosomes[:i], ga.Chromosomes[i+1:]...)
				removed++
			}
		}
	}
}

// AdjustMutationRate adjusts the mutation rate based on fitness performance
func (ga *GeneticAlgorithm) AdjustMutationRate() {
	if (ga.AverageFitness-ga.PastAverageFitness < 0) ||
		(math.Abs(ga.AverageFitness-ga.PastAverageFitness) <= ga.Settings.MutationRateAdjustmentTrigger) &&
			ga.MutationRate < 100 {
		ga.MutationRate += 0.1
	} else if ga.MutationRate > 0.1 {
		ga.MutationRate -= 0.1
	}
	ga.MutationRate = round(ga.MutationRate, 2)
}

// Selection selects the top performing chromosomes and performs tournament selection for the rest
func (ga *GeneticAlgorithm) Selection() {
	population := len(ga.Chromosomes)

	// Get all chromosome fitness's
	chromosomeFitness := make([]float64, population)
	for i, chromosome := range ga.Chromosomes {
		chromosomeFitness[i] = chromosome.Fitness
	}

	// Calculate elite population
	eliteCount := int(math.Round(float64(population) * ga.ElitePercent))
	if population%2 == 0 {
		if eliteCount%2 != 0 {
			eliteCount++
		}
	} else {
		if eliteCount%2 == 0 {
			eliteCount++
		}
	}
	ga.sendSignal(domain.ProgressBarSignal, 100)
	ga.sendSignal(domain.StatusSignal, fmt.Sprintf("Selection %d Elites", eliteCount))

	// Sort fitness in descending order
	sortedFitness := make([][2]int, population)
	for i, fitness := range chromosomeFitness {
		sortedFitness[i] = [2]int{i, int(fitness)}
	}
	sort.Slice(sortedFitness, func(i, j int) bool {
		return sortedFitness[i][1] > sortedFitness[j][1]
	})

	// Select elites
	elites := make([]*Chromosome, eliteCount)
	for i := 0; i < eliteCount; i++ {
		elites[i] = ga.Chromosomes[sortedFitness[i][0]]
	}
	ga.Elites = elites

	// Tournament selection
	matingPoolSize := (population - eliteCount) / 2
	tournamentSize := int(ga.TournamentSize * float64(population))
	if tournamentSize > 25 {
		tournamentSize = 25
	}
	ga.sendSignal(domain.ProgressBarSignal, 0)

	matingPool := make([][]int, matingPoolSize)
	for i := 0; i < matingPoolSize; i++ {
		couple := make([]int, 0, 2)
		for len(couple) != 2 {
			winner := ga.CreateTournament(tournamentSize, chromosomeFitness)
			if !contains(couple, winner) {
				couple = append(couple, winner)
			}
		}
		matingPool[i] = couple
	}
	ga.MatingPool = matingPool

}

// CreateTournament creates a tournament for chromosome selection
func (ga *GeneticAlgorithm) CreateTournament(size int, population []float64) int {
	participants := make([]int, size)
	for i := range participants {
		participants[i] = rand.Intn(len(population))
	}
	winner := participants[0]
	for _, participant := range participants {
		if population[participant] > population[winner] {
			winner = participant
		}
	}
	return winner
}

// Crossover performs crossover on the selected chromosomes
func (ga *GeneticAlgorithm) Crossover() {
	offspringCount := 0
	ga.Offsprings = []*Chromosome{}
	for _, couple := range ga.MatingPool {
		ga.sendSignal(domain.StatusSignal, fmt.Sprintf("Crossover %d from %d Offsprings", offspringCount, len(ga.Chromosomes)-len(ga.Elites)))
		ga.sendSignal(domain.ProgressBarSignal, offspringCount*100/(len(ga.Chromosomes)-len(ga.Elites)))
		ga.Offsprings = append(ga.Offsprings, ga.CreateOffspring(couple))
		offspringCount++
		couple[0], couple[1] = couple[1], couple[0]
		ga.sendSignal(domain.StatusSignal, fmt.Sprintf("Crossover %d from %d Offsprings", offspringCount, len(ga.Chromosomes)-len(ga.Elites)))
		ga.sendSignal(domain.ProgressBarSignal, offspringCount*100/(len(ga.Chromosomes)-len(ga.Elites)))
		ga.Offsprings = append(ga.Offsprings, ga.CreateOffspring(couple))
		offspringCount++
	}
	ga.Elites = copyChromosomes(ga.Elites)
	ga.Chromosomes = append(ga.Offsprings, ga.Elites...)
}

func copyChromosomes(chromosomes []*Chromosome) []*Chromosome {
	copies := make([]*Chromosome, len(chromosomes))
	for i, chromosome := range chromosomes {
		_copy := *chromosome
		copies[i] = &_copy
	}
	return copies
}

// CreateOffspring creates a new chromosome by mixing genes from parent chromosomes
func (ga *GeneticAlgorithm) CreateOffspring(parents []int) *Chromosome {
	offspring := NewChromosome(ga.Data, ga.Settings)
	parentA := ga.Chromosomes[parents[0]]
	parentB := ga.Chromosomes[parents[1]]
	parentAShareables := make(map[int]map[int]domain.CourseDetails)
	for sectionID, section := range parentA.Data.Semesters {
		parentAShareables[sectionID] = section.Details
	}

	for sectionID, subjects := range parentAShareables {
		sectionCarve := len(subjects) / 3
		startingPoint := len(subjects)/2 - sectionCarve + 1
		subjectIDs := make([]int, 0, len(subjects))
		for id := range subjects {
			subjectIDs = append(subjectIDs, id)
		}
		for i := startingPoint; i < startingPoint+sectionCarve; i++ {
			offspring.Data.Semesters[sectionID].Details[subjectIDs[i]] = subjects[subjectIDs[i]]
		}
	}

	for sectionID, section := range parentB.Data.Semesters {
		for id, subject := range section.Details {
			if _, found := offspring.Data.Semesters[sectionID].Details[id]; !found {
				offspring.Data.Semesters[sectionID].Details[id] = subject
			}
		}
	}

	for sectionID, subjects := range offspring.Data.Semesters {
		for subjectID := range subjects.Details {
			if len(subjects.Details[subjectID].Days) == 0 {
				offspring.Data.Unplaced[sectionID] = append(offspring.Data.Unplaced[sectionID], subjectID)
			}
		}
	}
	for sectionID, subjects := range offspring.Data.Unplaced {
		for _, subjectID := range subjects {
			if ga.GenerateSubjectPlacement([]int{sectionID}, subjectID) {
				offspring.Data.Unplaced[sectionID] = removeFromSlice(offspring.Data.Unplaced[sectionID], subjectID)
			}
		}
	}
	return offspring
}

func removeFromSlice(slice []int, item int) []int {
	for i, v := range slice {
		if v == item {
			return append(slice[:i], slice[i+1:]...)
		}
	}
	return slice
}

// Mutation performs mutation on the chromosomes
func (ga *GeneticAlgorithm) Mutation() {
	mutationCandidates := make(map[int][]int)
	for sectionID, section := range ga.Data.Semesters {
		mutationCandidates[sectionID] = ConvertUintSliceToIntSlice(section.CourseIds)
	}

	for sectionID, subjects := range mutationCandidates {
		if len(subjects) == 0 {
			delete(mutationCandidates, sectionID)
		}
	}
	ga.sendSignal(domain.ProgressBarSignal, 0)
	ga.sendSignal(domain.ProgressSignal, "Creating mutations in chromosome")

	for i, chromosome := range ga.Chromosomes {
		if rand.Intn(100) > int(ga.MutationRate*100)-1 {
			continue
		}
		ga.sendSignal(domain.StatusSignal, fmt.Sprintf("Chromosome Mutation %d", i+1))
		ga.sendSignal(domain.ProgressBarSignal, i*100/len(ga.Chromosomes))
		ga.TempChromosome = NewChromosome(ga.Data, ga.Settings)
		sectionID := randomKey(mutationCandidates)
		subjectID := mutationCandidates[sectionID][rand.Intn(len(mutationCandidates[sectionID]))]
		for section, subjects := range chromosome.Data.Semesters {
			for subject := range subjects.Details {
				if section == sectionID && subject == subjectID {
					continue
				}
				details := subjects.Details[subject]
				if len(details.Days) > 0 {
					ga.TempChromosome.InsertSchedule([]int{details.RoomID, section, subject, details.InstructorID, details.Days[0], details.StartSlot, details.Length})
				}
			}
		}
		ga.GenerateSubjectPlacement([]int{sectionID}, subjectID)
		ga.Chromosomes[i] = ga.TempChromosome
	}
}

func randomKey(m map[int][]int) int {
	keys := make([]int, len(m))
	i := 0
	for key := range m {
		keys[i] = key
		i++
	}
	return keys[rand.Intn(len(keys))]
}

func (ga *GeneticAlgorithm) RunGeneration() {
	ga.sendSignal(domain.ProgressBarSignal, 0)
	ga.sendSignal(domain.StatusSignal, "Preparer")
	ga.sendSignal(domain.ProgressSignal, "Preparer")
	ga.Initialization()

	generation := 0
	for ga.Running {
		generation++
		ga.sendSignal(domain.StatusSignal, fmt.Sprintf("Material evaluation"))
		ga.sendSignal(domain.ProgressSignal, "Prepare for assessment")
		//log.Printf("Generation %d: Starting evaluation", generation)
		ga.Evaluate()
		ga.sendSignal(domain.DetailsSignal, []interface{}{
			generation, len(ga.Chromosomes), int(ga.MutationRate * 100), math.Round(ga.AverageFitness*100) / 100,
			math.Round(ga.PastAverageFitness*100) / 100, ga.HighestFitness, ga.LowestFitness,
			math.Round((ga.HighestFitness/ga.Settings.MaximumFitness)*100*100) / 100,
		})
		//log.Printf("Generation %d: Fitness details - Average: %.2f, Highest: %.2f, Lowest: %.2f", generation, ga.AverageFitness, ga.HighestFitness, ga.LowestFitness)
		if ga.HighestFitness >= ga.Settings.MaximumFitness || ga.Settings.MaximumGenerations < generation {
			if ga.HighestFitness >= ga.Settings.MaximumFitness {
				ga.sendSignal(domain.StatusSignal, "Reaching the highest level of fitness")
			} else {
				ga.sendSignal(domain.StatusSignal, "Reaching the highest level of creation")
			}
			ga.sendSignal(domain.ProgressSignal, "End of operation")
			ga.sendSignal(domain.ProgressBarSignal, 100)
			ga.sendSignal(domain.OperationSignal, 1)
			// Save top chromosomes to the database
			topChromosomeData := ga.GetTopChromosomeData(5)
			numIterations, successCount, totalCount := calculateMetrics(ga)

			if err := ga.SaveTopChromosomeDataToDB(topChromosomeData, numIterations, successCount, totalCount); err != nil {
				log.Println("Error saving top chromosome data to database:", err)
			}

			ga.Running = false
			break
		}
		ga.sendSignal(domain.StatusSignal, "Improvement")
		ga.sendSignal(domain.ProgressSignal, "Improve the environment")
		ga.Adapt()
		ga.sendSignal(domain.StatusSignal, "Preparation for selection")
		ga.sendSignal(domain.ProgressSignal, "Preparation for selection")
		ga.Selection()
		ga.sendSignal(domain.StatusSignal, "Creation Cross Over")
		ga.sendSignal(domain.ProgressSignal, "Creation Cross Over")
		ga.Crossover()
		ga.sendSignal(domain.StatusSignal, "Preparation for the second stage")
		ga.sendSignal(domain.ProgressSignal, "Preparation for the first stage")
		ga.Mutation()
	}
}
func ConvertUintSliceToIntSlice(uintSlice []uint) []int {
	intSlice := make([]int, len(uintSlice))
	for i, v := range uintSlice {
		intSlice[i] = int(v)
	}
	return intSlice
}

func (ga *GeneticAlgorithm) GetTopChromosomeData(n int) []domain.ChromosomeData {
	// Sort chromosomes by fitness
	sort.Slice(ga.Chromosomes, func(i, j int) bool {
		return ga.Chromosomes[i].Fitness > ga.Chromosomes[j].Fitness
	})

	// Determine the number of top chromosomes to retrieve
	if len(ga.Chromosomes) < n {
		n = len(ga.Chromosomes)
	}

	// Collect the top chromosome data
	topChromosomeData := make([]domain.ChromosomeData, n)
	for i := 0; i < n; i++ {
		topChromosomeData[i] = ga.Chromosomes[i].Data
	}
	return topChromosomeData
}
func (ga *GeneticAlgorithm) SaveTopChromosomeDataToDB(topChromosomeData []domain.ChromosomeData, numIterations int, successCount int, totalCount int) error {

	for _, data := range topChromosomeData {
		// Enhance the data with instructor names and course names
		for semesterID, semesterDetails := range data.Semesters {
			for courseID, courseDetails := range semesterDetails.Details {
				// Get instructor name
				instructorName := ""
				if instructor, exists := ga.Data.Instructors[courseDetails.InstructorID]; exists {
					instructorName = instructor.Name
				}

				// Get course name
				courseName := ""
				if course, exists := ga.Data.Courses[courseID]; exists {
					courseName = course.Name
				}

				// Add instructor name and course name to courseDetails
				courseDetailsWithName := domain.CourseDetails{
					RoomID:         courseDetails.RoomID,
					InstructorID:   courseDetails.InstructorID,
					InstructorName: instructorName,
					Days:           courseDetails.Days,
					StartSlot:      courseDetails.StartSlot,
					Length:         courseDetails.Length,
					CourseName:     courseName,
				}

				semesterDetails.Details[courseID] = courseDetailsWithName
			}
			data.Semesters[semesterID] = semesterDetails
		}

		semesterDataJSON, err := json.Marshal(data.Semesters)
		if err != nil {
			return err
		}
		successRate := float64(successCount) / float64(totalCount) * 100

		result := domain.Result{
			UniversityID:   ga.UniversityID,
			SemesterID:     ga.SemesterID,
			TopChromosomes: datatypes.JSON(semesterDataJSON),
			Timestamp:      time.Now(),
			NumIterations:  numIterations,
			SuccessCount:   successCount,
			TotalCount:     totalCount,
			SuccessRate:    successRate,
			AverageFitness: int(ga.AverageFitness),
		}

		if err := ga.DB.Create(&result).Error; err != nil {
			return err
		}
	}
	return nil
}
func calculateMetrics(ga *GeneticAlgorithm) (numIterations int, successCount int, totalCount int) {
	totalCount = 0
	successCount = 0
	for _, chromosome := range ga.Chromosomes {
		if chromosome.Fitness >= ga.AverageFitness {
			successCount++
		}
		totalCount++
	}
	return len(ga.Chromosomes), successCount, totalCount
}
