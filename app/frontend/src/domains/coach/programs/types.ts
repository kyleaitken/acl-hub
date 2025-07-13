
export type AddCoachProgramDTO = {
  programName: string;
  programDescription?: string;
  num_weeks: number;
};

export type UpdateCoachProgramDTO = {
  programId: number;
  programName?: string;
  programDescription?: string;
  num_weeks?: number;
};

export interface CoachProgram {
  id: number;
  coach_id: number;
  num_weeks: number;
  name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  tags: ProgramTag[];
}

export interface ProgramTag {
  id: number;
  name: string;
}
