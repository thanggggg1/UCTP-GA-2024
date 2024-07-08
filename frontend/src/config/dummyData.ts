export const dummyEvents = [
  {
    id: 0,
    title: "Introduction to MS training",
    start: new Date(2018, 0, 29, 9, 0, 0),
    end: new Date(2018, 0, 29, 13, 0, 0),
    resourceId: 1,
  },
  {
    id: 1,
    title: "Introduction to MS training",
    allDay: true,
    start: new Date(2018, 0, 29, 14, 0, 0),
    end: new Date(2018, 0, 29, 16, 30, 0),
    resourceId: 2,
  },
  {
    id: 2,
    title: "Computer Science",
    start: new Date(2018, 0, 29, 8, 30, 0),
    end: new Date(2018, 0, 29, 12, 30, 0),
    resourceId: [2, 3],
  },
  {
    id: 11,
    title: "Computer Network",
    start: new Date(2018, 0, 30, 7, 0, 0),
    end: new Date(2018, 0, 30, 10, 30, 0),
    resourceId: 4,
  },
];

export const dummyResources = [
  { resourceId: 1, resourceTitle: "D9 - 501" },
  { resourceId: 2, resourceTitle: "D9 - 502" },
  { resourceId: 3, resourceTitle: "Labor 102" },
  { resourceId: 4, resourceTitle: "Labor 103" },
];
export interface IPeriodData {
  lab: boolean;
  number_of_seats: number;
  room_name: string;
  room_id: number;
  schedule: {
    period: string;
    schedule: {
      content: {
        course_name: string;
        criteria: {
          criterion: string;
        }[];
        group_names: string[];
        lab_required: boolean;
        professor_name: string;
      };
      day: string;
    }[];
  }[];
}
export const periodData: IPeriodData[] = [
  {
    lab: true,
    number_of_seats: 24,
    room_id: 0,
    room_name: "R3",
    schedule: [
      {
        period: "9 - 10",
        schedule: [
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1"],
              lab_required: true,
              professor_name: "Ben",
            },
            day: "TUE",
          },
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3"],
              lab_required: true,
              professor_name: "Ben",
            },
            day: "THU",
          },
          {
            content: {
              course_name: "Business Applications",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3"],
              lab_required: false,
              professor_name: "John",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "10 - 11",
        schedule: [
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O2"],
              lab_required: true,
              professor_name: "Ben",
            },
            day: "MON",
          },
        ],
      },
      {
        period: "11 - 12",
        schedule: [],
      },
      {
        period: "12 - 13",
        schedule: [
          {
            content: {
              course_name: "System Administration and Maintenance I",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1S1"],
              lab_required: false,
              professor_name: "Alex",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "13 - 14",
        schedule: [
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1S1"],
              lab_required: true,
              professor_name: "Philip",
            },
            day: "TUE",
          },
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1"],
              lab_required: true,
              professor_name: "Philip",
            },
            day: "THU",
          },
        ],
      },
      {
        period: "14 - 15",
        schedule: [
          {
            content: {
              course_name: "Business Applications",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O2"],
              lab_required: false,
              professor_name: "John",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "15 - 16",
        schedule: [
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O2"],
              lab_required: true,
              professor_name: "Philip",
            },
            day: "WED",
          },
        ],
      },
      {
        period: "16 - 17",
        schedule: [
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1S1"],
              lab_required: true,
              professor_name: "Ben",
            },
            day: "MON",
          },
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3"],
              lab_required: true,
              professor_name: "Philip",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "17 - 18",
        schedule: [],
      },
      {
        period: "18 - 19",
        schedule: [
          {
            content: {
              course_name: "Business Applications",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1S1"],
              lab_required: false,
              professor_name: "Ann",
            },
            day: "TUE",
          },
        ],
      },
      {
        period: "19 - 20",
        schedule: [],
      },
      {
        period: "20 - 21",
        schedule: [],
      },
    ],
  },
  {
    lab: false,
    number_of_seats: 60,
    room_id: 1,
    room_name: "R7",
    schedule: [
      {
        period: "9 - 10",
        schedule: [
          {
            content: {
              course_name: "English",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3", "1S1"],
              lab_required: false,
              professor_name: "Marry",
            },
            day: "MON",
          },
          {
            content: {
              course_name: "Discrete Mathematic I",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3"],
              lab_required: false,
              professor_name: "Mike",
            },
            day: "TUE",
          },
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3", "1S1"],
              lab_required: false,
              professor_name: "Victor",
            },
            day: "WED",
          },
          {
            content: {
              course_name: "English",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2"],
              lab_required: false,
              professor_name: "Marry",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "10 - 11",
        schedule: [
          {
            content: {
              course_name: "English",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2"],
              lab_required: false,
              professor_name: "Marry",
            },
            day: "THU",
          },
        ],
      },
      {
        period: "11 - 12",
        schedule: [
          {
            content: {
              course_name: "English",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3", "1S1"],
              lab_required: false,
              professor_name: "Marry",
            },
            day: "MON",
          },
          {
            content: {
              course_name: "Introduction to Information Technology I",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1S1"],
              lab_required: false,
              professor_name: "Steve",
            },
            day: "WED",
          },
        ],
      },
      {
        period: "12 - 13",
        schedule: [
          {
            content: {
              course_name: "Introduction to Programming",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2"],
              lab_required: false,
              professor_name: "Victor",
            },
            day: "TUE",
          },
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2"],
              lab_required: false,
              professor_name: "Red",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "13 - 14",
        schedule: [
          {
            content: {
              course_name: "Discrete Mathematic I",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2"],
              lab_required: false,
              professor_name: "Peter",
            },
            day: "MON",
          },
          {
            content: {
              course_name: "Linear Algebra",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2", "1O3"],
              lab_required: false,
              professor_name: "Don",
            },
            day: "WED",
          },
        ],
      },
      {
        period: "14 - 15",
        schedule: [
          {
            content: {
              course_name: "Business Applications",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1"],
              lab_required: false,
              professor_name: "Ann",
            },
            day: "FRI",
          },
        ],
      },
      {
        period: "15 - 16",
        schedule: [],
      },
      {
        period: "16 - 17",
        schedule: [],
      },
      {
        period: "17 - 18",
        schedule: [
          {
            content: {
              course_name: "Discrete Mathematic I",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2", "1O3"],
              lab_required: false,
              professor_name: "Peter",
            },
            day: "MON",
          },
        ],
      },
      {
        period: "18 - 19",
        schedule: [
          {
            content: {
              course_name: "Linear Algebra",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O1", "1O2", "1O3"],
              lab_required: false,
              professor_name: "Don",
            },
            day: "TUE",
          },
          {
            content: {
              course_name: "Introduction to Computer Architecture",
              criteria: [
                {
                  criterion: "R",
                },
                {
                  criterion: "S",
                },
                {
                  criterion: "L",
                },
                {
                  criterion: "P",
                },
                {
                  criterion: "G",
                },
              ],
              group_names: ["1O3", "1S1"],
              lab_required: false,
              professor_name: "Red",
            },
            day: "THU",
          },
        ],
      },
      {
        period: "19 - 20",
        schedule: [],
      },
      {
        period: "20 - 21",
        schedule: [],
      },
    ],
  },
];
