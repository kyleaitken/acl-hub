module Coaches
  module Programs
    class UpdateWorkoutPositions
      include CoreServices::Callable

      def initialize(coach, id, workouts_data)
        @coach         = coach
        @program_id    = id
        @workouts_data = workouts_data
      end

      def call
        program = @coach.programs.find(@program_id)
        errors  = []

        ProgramWorkout.transaction do
          @workouts_data.each do |data|
            pw = program.program_workouts.find(data[:id])
            unless pw.update(data.permit(:day, :week, :order))
              errors << { id: pw.id, errors: pw.errors.full_messages }
            end
          end
          raise ActiveRecord::Rollback if errors.any?
        end

        if errors.any?
          Failure(errors: errors)
        else
          program.reload
          Success(program: program)
        end
      end
    end
  end
end
