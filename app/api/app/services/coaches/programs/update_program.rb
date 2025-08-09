module Coaches
  module Programs
    class UpdateProgram
      include CoreServices::Callable

      def initialize(coach, id, attrs)
        @coach = coach
        @id    = id
        @attrs = attrs
      end

      def call
        program = @coach.programs.find(@id)
        if program.update(@attrs)
          Success(program: program)
        else
          Failure(errors: program.errors.full_messages)
        end
      end
    end
  end
end
