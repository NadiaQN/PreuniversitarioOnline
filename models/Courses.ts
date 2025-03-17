export interface CourseMaterial {
    name: string;
    uri: string;
}

export interface Course {
    id: string;
    name: string;
    description: string;
    objectives: string;
    materials: CourseMaterial[];
}

