class AddWarmupAndCooldownToProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    add_reference :program_workouts, :warmup, null: false, foreign_key: true
    add_reference :program_workouts, :cooldown, null: false, foreign_key: true
  end
end
