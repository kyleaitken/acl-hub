# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_06_15_004635) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "client_outcome_measure_recordings", force: :cascade do |t|
    t.bigint "client_outcome_measure_id", null: false
    t.string "value"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_outcome_measure_id"], name: "idx_on_client_outcome_measure_id"
  end

  create_table "client_outcome_measures", force: :cascade do |t|
    t.bigint "outcome_measure_id", null: false
    t.bigint "client_id", null: false
    t.string "target_value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_id"], name: "index_client_outcome_measures_on_client_id"
    t.index ["outcome_measure_id"], name: "idx_outcome_measure_id"
  end

  create_table "client_program_workout_exercises", force: :cascade do |t|
    t.bigint "client_program_workout_id", null: false
    t.bigint "exercise_id", null: false
    t.string "order"
    t.string "instructions"
    t.integer "sets"
    t.integer "reps"
    t.float "weight"
    t.string "duration"
    t.string "hold"
    t.boolean "completed", default: false
    t.string "results"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["client_program_workout_id"], name: "idx_on_client_program_workout_id"
    t.index ["exercise_id"], name: "index_client_program_workout_exercises_on_exercise_id"
  end

  create_table "client_program_workouts", force: :cascade do |t|
    t.bigint "client_program_id", null: false
    t.date "date"
    t.integer "day"
    t.integer "week"
    t.boolean "completed", default: false
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "updated", default: false, null: false
    t.string "name"
    t.text "warmup"
    t.index ["client_program_id", "date", "order"], name: "idx_on_client_program_id_date_order", unique: true
    t.index ["client_program_id"], name: "index_client_program_workouts_on_client_program_id"
  end

  create_table "client_programs", force: :cascade do |t|
    t.bigint "client_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.date "start_date"
    t.date "end_date"
    t.integer "num_weeks"
    t.string "name"
    t.string "description"
    t.index ["client_id"], name: "index_client_programs_on_client_id"
  end

  create_table "clients", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.date "birth_date", null: false
    t.string "email", null: false
    t.string "phone", null: false
    t.string "encrypted_password", default: "", null: false
    t.boolean "active", default: true, null: false
    t.bigint "coach_id", null: false
    t.string "profile_picture_url"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["coach_id"], name: "index_clients_on_coach_id"
    t.index ["email"], name: "index_clients_on_email", unique: true
    t.index ["reset_password_token"], name: "index_clients_on_reset_password_token", unique: true
  end

  create_table "coaches", force: :cascade do |t|
    t.string "first_name", null: false
    t.string "last_name", null: false
    t.string "email", null: false
    t.string "phone", null: false
    t.string "bio"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "profile_picture_url"
    t.index ["reset_password_token"], name: "index_coaches_on_reset_password_token", unique: true
  end

  create_table "exercise_images", force: :cascade do |t|
    t.bigint "exercise_id", null: false
    t.integer "order"
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id", "order"], name: "index_exercise_images_on_exercise_id_and_order", unique: true
    t.index ["exercise_id"], name: "index_exercise_images_on_exercise_id"
  end

  create_table "exercises", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "category"
    t.string "muscle_group"
    t.string "video_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "oauth_access_grants", force: :cascade do |t|
    t.bigint "resource_owner_id", null: false
    t.bigint "application_id", null: false
    t.string "token", null: false
    t.integer "expires_in", null: false
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "resource_owner_type"
    t.index ["application_id"], name: "index_oauth_access_grants_on_application_id"
    t.index ["resource_owner_type", "resource_owner_id"], name: "index_oauth_access_grants_on_polymorphic_owner"
    t.index ["token"], name: "index_oauth_access_grants_on_token", unique: true
  end

  create_table "oauth_access_tokens", force: :cascade do |t|
    t.bigint "resource_owner_id"
    t.bigint "application_id"
    t.string "token", null: false
    t.string "refresh_token"
    t.integer "expires_in"
    t.string "scopes"
    t.datetime "created_at", null: false
    t.datetime "revoked_at"
    t.string "previous_refresh_token", default: "", null: false
    t.string "resource_owner_type", default: "Client"
    t.index ["application_id"], name: "index_oauth_access_tokens_on_application_id"
    t.index ["refresh_token"], name: "index_oauth_access_tokens_on_refresh_token", unique: true
    t.index ["resource_owner_type", "resource_owner_id"], name: "index_oauth_access_tokens_on_polymorphic_owner"
    t.index ["token"], name: "index_oauth_access_tokens_on_token", unique: true
  end

  create_table "oauth_applications", force: :cascade do |t|
    t.string "name", null: false
    t.string "uid", null: false
    t.string "secret"
    t.text "redirect_uri", null: false
    t.string "scopes", default: "", null: false
    t.boolean "confidential", default: true, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["uid"], name: "index_oauth_applications_on_uid", unique: true
  end

  create_table "outcome_measures", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "program_workout_exercises", force: :cascade do |t|
    t.bigint "program_workout_id", null: false
    t.bigint "exercise_id", null: false
    t.string "order"
    t.string "instructions"
    t.integer "sets"
    t.integer "reps"
    t.float "weight"
    t.string "duration"
    t.string "hold"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["exercise_id"], name: "index_program_workout_exercises_on_exercise_id"
    t.index ["program_workout_id"], name: "index_program_workout_exercises_on_program_workout_id"
  end

  create_table "program_workouts", force: :cascade do |t|
    t.bigint "program_id", null: false
    t.integer "day"
    t.integer "week"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["program_id"], name: "index_program_workouts_on_program_id"
  end

  create_table "programs", force: :cascade do |t|
    t.bigint "coach_id", null: false
    t.integer "num_weeks"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "description"
    t.index ["coach_id"], name: "index_programs_on_coach_id"
  end

  create_table "workout_comments", force: :cascade do |t|
    t.bigint "client_program_workout_id", null: false
    t.text "content"
    t.datetime "timestamp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "user_type", null: false
    t.index ["client_program_workout_id"], name: "index_workout_comments_on_client_program_workout_id"
  end

  add_foreign_key "client_outcome_measure_recordings", "client_outcome_measures", on_delete: :cascade
  add_foreign_key "client_outcome_measures", "clients", on_delete: :cascade
  add_foreign_key "client_outcome_measures", "outcome_measures", on_delete: :cascade
  add_foreign_key "client_program_workout_exercises", "client_program_workouts"
  add_foreign_key "client_program_workout_exercises", "exercises"
  add_foreign_key "client_program_workouts", "client_programs"
  add_foreign_key "client_programs", "clients"
  add_foreign_key "clients", "coaches"
  add_foreign_key "exercise_images", "exercises"
  add_foreign_key "oauth_access_grants", "oauth_applications", column: "application_id"
  add_foreign_key "oauth_access_tokens", "oauth_applications", column: "application_id"
  add_foreign_key "program_workout_exercises", "exercises"
  add_foreign_key "program_workout_exercises", "program_workouts"
  add_foreign_key "program_workouts", "programs"
  add_foreign_key "programs", "coaches"
  add_foreign_key "workout_comments", "client_program_workouts"
end
