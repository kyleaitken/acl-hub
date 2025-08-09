namespace :db do
  desc "Blow away any custom warmups/cooldowns not used by a ProgramWorkout"
  task cleanup_orphans: :environment do
    puts "Orphaned Warmups:"
    Warmup.custom
          .left_outer_joins(:program_workouts)
          .where(program_workouts: { id: nil })
          .pluck(:id, :name)
          .each { |id,name| puts "  ##{id} #{name}" }
    Warmup.custom
          .left_outer_joins(:program_workouts)
          .where(program_workouts: { id: nil })
          .destroy_all

    puts "Orphaned Cooldowns:"
    Cooldown.custom
            .left_outer_joins(:program_workouts)
            .where(program_workouts: { id: nil })
            .pluck(:id, :name)
            .each { |id,name| puts "  ##{id} #{name}" }
    Cooldown.custom
            .left_outer_joins(:program_workouts)
            .where(program_workouts: { id: nil })
            .destroy_all

    puts "Orphaned Exercises:"
    orphaned = Exercise.custom
                        .left_outer_joins(:program_workout_exercises, :warmup_exercises, :cooldown_exercises)
                        .where(
                          program_workout_exercises: { id: nil },
                          warmup_exercises:           { id: nil },
                          cooldown_exercises:         { id: nil }
                        )

    orphaned.pluck(:id, :name).each do |id, name|
      puts "  ##{id} #{name}"
    end
    orphaned.destroy_all

    puts "Done."
  end
end
