interface ISetting {
  id: number;
  maximum_generations: number;
  minimum_population: number;
  elite_percent: number;
  ending_time: number;
  generation_tolerance: number;
  deviation_tolerance: number;
  lunchbreak: boolean;
  starting_time: number;
  idle_time: number;
  subject_placement: number;
  mutation_rate_adjustment_trigger: number;
  mutation_rate_base: number;
  mutation_rate_step: number;
  maximum_population: number;
  maximum_fitness: number;
  university_id?: number;
  university?: IUniversity;
  timeslots: string[];
}
// {"maximum_generations": 70, "minimum_population": 61, "elite_percent": 0.05, "ending_time": 15, "generation_tolerance": 20, "deviation_tolerance": 57, "lunchbreak": true, "starting_time": 0, "evaluation_matrix": {"idle_time": 0, "subject_placement": 93}, "mutation_rate_adjustment_trigger": 3.26, "mutation_rate_base": 4.5, "mutation_rate_step": 6.2, "maximum_population": 112, "maximum_fitness": 97}
