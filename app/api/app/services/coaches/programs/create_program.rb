module Coaches
  module Programs
    class CreateProgram
      include CoreServices::Callable

      def initialize(coach, attrs)
        @coach = coach
        @attrs = attrs
      end

      def call
        program = @coach.programs.build(@attrs)
        if program.save
          Success(program: program)
        else
          Failure(errors: program.errors.full_messages)
        end
      end
    end
  end
end
