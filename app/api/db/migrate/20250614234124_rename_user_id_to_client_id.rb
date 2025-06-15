class RenameUserIdToClientId < ActiveRecord::Migration[7.0]
  def change
    # Step 1: Remove all foreign keys and indexes before renaming tables or columns

    # user_outcome_measures
    remove_foreign_key :user_outcome_measures, column: :user_id
    remove_index :user_outcome_measures, :user_id
    remove_index :user_outcome_measures, name: "index_user_outcome_measures_on_outcome_measure_id"

    # user_outcome_measure_recordings
    remove_foreign_key :user_outcome_measure_recordings, column: :user_outcome_measure_id
    remove_index :user_outcome_measure_recordings, name: "idx_on_user_outcome_measure_id_3a41ca920e"

    # user_programs
    remove_foreign_key :user_programs, column: :user_id
    remove_index :user_programs, :user_id

    # user_program_workouts
    remove_foreign_key :user_program_workouts, column: :user_program_id
    remove_index :user_program_workouts, name: "index_user_program_workouts_on_user_program_id"
    remove_index :user_program_workouts, name: "idx_on_user_program_id_date_order_6c71253c53"

    # user_program_workout_exercises
    remove_foreign_key :user_program_workout_exercises, column: :user_program_workout_id
    remove_index :user_program_workout_exercises, name: "idx_on_user_program_workout_id_8fc81ea38a"
    remove_index :user_program_workout_exercises, name: "index_user_program_workout_exercises_on_exercise_id"

    # workout_comments
    remove_foreign_key :workout_comments, column: :user_program_workout_id
    remove_index :workout_comments, :user_program_workout_id

    # Step 2: Rename all relevant tables
    rename_table :user_outcome_measures, :client_outcome_measures
    rename_table :user_outcome_measure_recordings, :client_outcome_measure_recordings
    rename_table :user_programs, :client_programs
    rename_table :user_program_workouts, :client_program_workouts
    rename_table :user_program_workout_exercises, :client_program_workout_exercises

    # Step 3: Rename all columns
    rename_column :client_outcome_measures, :user_id, :client_id
    rename_column :client_outcome_measure_recordings, :user_outcome_measure_id, :client_outcome_measure_id
    rename_column :client_programs, :user_id, :client_id
    rename_column :client_program_workouts, :user_program_id, :client_program_id
    rename_column :client_program_workout_exercises, :user_program_workout_id, :client_program_workout_id
    rename_column :workout_comments, :user_program_workout_id, :client_program_workout_id

    # Step 4: Re-add indexes and foreign keys with updated names

    # client_outcome_measures
    add_index :client_outcome_measures, :client_id
    add_index :client_outcome_measures, :outcome_measure_id, name: "idx_outcome_measure_id"
    add_foreign_key :client_outcome_measures, :clients, column: :client_id, on_delete: :cascade

    # client_outcome_measure_recordings
    add_index :client_outcome_measure_recordings, :client_outcome_measure_id, name: "idx_on_client_outcome_measure_id"
    add_foreign_key :client_outcome_measure_recordings, :client_outcome_measures, column: :client_outcome_measure_id, on_delete: :cascade

    # client_programs
    add_index :client_programs, :client_id
    add_foreign_key :client_programs, :clients, column: :client_id

    # client_program_workouts
    add_index :client_program_workouts, :client_program_id
    add_index :client_program_workouts, [:client_program_id, :date, :order], name: "idx_on_client_program_id_date_order", unique: true
    add_foreign_key :client_program_workouts, :client_programs, column: :client_program_id

    # client_program_workout_exercises
    add_index :client_program_workout_exercises, :client_program_workout_id, name: "idx_on_client_program_workout_id"
    add_index :client_program_workout_exercises, :exercise_id, name: "index_client_program_workout_exercises_on_exercise_id"
    add_foreign_key :client_program_workout_exercises, :client_program_workouts, column: :client_program_workout_id

    # workout_comments
    add_index :workout_comments, :client_program_workout_id
    add_foreign_key :workout_comments, :client_program_workouts, column: :client_program_workout_id
  end
end
