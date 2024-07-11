export interface IMetrics {
  total_instructors: number;
  total_courses: number;
  total_rooms: number;
  total_schedules: number;
  num_iterations: number;
  average_fitness: number;
  success_count: number;
  total_count: number;
  success_rate: number;
}

export interface IChartMetrics {
  date: string;
  average_fitness: number;
  success_rate: number;
}
