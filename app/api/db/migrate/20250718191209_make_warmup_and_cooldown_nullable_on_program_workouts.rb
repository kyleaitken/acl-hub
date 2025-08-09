class MakeWarmupAndCooldownNullableOnProgramWorkouts < ActiveRecord::Migration[7.2]
  def change
    change_column_null :program_workouts, :warmup_id, true
    change_column_null :program_workouts, :cooldown_id, true
  end
end
