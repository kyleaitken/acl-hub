module Coaches
  module Programs
    class AddTag
      include CoreServices::Callable

      def initialize(coach, program_id, tag_id)
        @coach      = coach
        @program_id = program_id
        @tag_id     = tag_id
      end

      def call
        program = @coach.programs.find(@program_id)
        tag     = @coach.tags.find(@tag_id)
        program.tags << tag unless program.tags.include?(tag)
        Success(program: program)
      rescue ActiveRecord::RecordNotFound => e
        Failure(errors: [e.message])
      end
    end
  end
end
