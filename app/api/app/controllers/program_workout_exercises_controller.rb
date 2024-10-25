class ProgramWorkoutExercisesController < ApplicationController
    before_action :set_program_workout

    # GET /program_workouts/:program_workout_id/program_workout_exercises
    def index
        @program_workout_exercises = @program_workout.program_workout_exercises.includes(:exercise)
        render json: @program_workout_exercises.as_json(include: :exercise)
    end

    # GET /program_workouts/:program_workout_id/program_workout_exercises/:id
    def show
        @program_workout_exercise = @program_workout.program_workout_exercises.find(params[:id])
        render json: @program_workout_exercise.as_json(include: :exercise)
    end

    # POST /program_workouts/:program_workout_id/program_workout_exercises
    def create
        @program_workout_exercise = @program_workout.program_workout_exercises.build(program_workout_exercise_params)
        if @program_workout_exercise.save
            render json: @program_workout_exercise, status: :created
        else 
            render json: @program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # PUT /program_workouts/:program_workout_id/program_workout_exercises/:id
    def update
        @program_workout_exercise = @program_workout.program_workout_exercises.find(params[:id])
        if @program_workout_exercise.update(program_workout_exercise_params)
            render json: @program_workout_exercise
        else
            render json: @program_workout_exercise.errors, status: :unprocessable_entity
        end
    end

    # DELETE /program_workouts/:program_workout_id/program_workout_exercises/:id
    def destroy
        @program_workout_exercise = @program_workout.program_workout_exercises.find(params[:id])
        @program_workout_exercise.destroy
        head :no_content
    end

    private
    
    def set_program_workout
        @program_workout = ProgramWorkout.find(params[:program_workout_id])
    end

    def program_workout_exercise_params
        params.require(:program_workout_exercise).permit(:exercise_id, :order, :instructions, :sets, :reps, :weight, :duration, :hold)
    end
end