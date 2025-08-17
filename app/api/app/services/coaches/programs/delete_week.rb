module Coaches
  module Programs
    class DeleteWeek
      include CoreServices::Callable

      def initialize(coach, program_id, week_num)
        @coach      = coach
        @program_id = program_id
        @week_num   = week_num.to_i
      end

      def call
        program = @coach.programs.find(@program_id)

        ProgramWorkout.transaction do
          # 1) delete all workouts in that week
          program.program_workouts
                 .where(week: @week_num)
                 .find_each { |pw| pw.destroy! }

          # 2) shift all later workouts up one week
          program.program_workouts
                 .where("week > ?", @week_num)
                 .find_each { |pw| pw.update!(week: pw.week - 1) }

          # 3) decrement the total number of weeks
          program.decrement!(:num_weeks)
        end

        Success(program: program.reload)
      rescue ActiveRecord::RecordNotFound
        Failure(errors: ["Program not found"])
      end
    end
  end
end
