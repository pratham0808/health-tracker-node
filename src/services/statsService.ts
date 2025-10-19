import Log from '../models/Log';
import moment from 'moment';

export interface DailyStats {
  reps: number;
  count: number;
}

export interface ExerciseStats {
  exerciseName: string;
  dailyData: { [date: string]: DailyStats };
  totals: DailyStats;
  lifetimeAverage: {
    reps: number;
    count: number;
  };
  daysInPeriod: number;
  expectedFromAverage: {
    reps: number;
    count: number;
  };
}

export interface OverallStats {
  currentStreak: number;
  longestStreak: number;
  totalWorkoutDays: number;
  totalExercises: number;
  periodTotal: { reps: number; count: number };
  lifetimeAverage: { reps: number; count: number };
  comparisonPercent: number;
}

export class StatsService {
  async getEnhancedStats(userId: string, days: number = 7, category?: string): Promise<{ exercises: ExerciseStats[]; overall: OverallStats }> {
    const periodEnd = moment().format('YYYY-MM-DD');
    const periodStart = moment().subtract(days - 1, 'days').format('YYYY-MM-DD');
    
    // Get logs for selected period and all-time
    const periodLogs = await this.getLogsForPeriod(userId, periodStart, periodEnd, category);
    const allTimeLogs = await this.getAllLogs(userId, category);
    
    // Calculate streaks and overall stats
    const overall = await this.calculateOverallStats(userId, periodLogs, allTimeLogs, days);
    
    // Process exercise stats
    const exercises = this.processExerciseStats(periodLogs, allTimeLogs, days);
    
    return { exercises, overall };
  }

  private async getLogsForPeriod(userId: string, startDate: string, endDate: string, category?: string) {
    const query: any = {
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    if (category) {
      query.category = category;
    }
    
    return await Log.find(query).sort({ date: 1 });
  }

  private async getAllLogs(userId: string, category?: string) {
    const query: any = { userId };
    if (category) {
      query.category = category;
    }
    return await Log.find(query).sort({ date: 1 });
  }

  private processExerciseStats(periodLogs: any[], allTimeLogs: any[], days: number): ExerciseStats[] {
    const exerciseMap = new Map<string, ExerciseStats>();
    
    // Process current period logs
    periodLogs.forEach(log => {
      const logDate = moment(log.date).format('YYYY-MM-DD');
      
      if (!exerciseMap.has(log.exerciseName)) {
        exerciseMap.set(log.exerciseName, {
          exerciseName: log.exerciseName,
          dailyData: {},
          totals: { reps: 0, count: 0 },
          lifetimeAverage: { reps: 0, count: 0 },
          daysInPeriod: days,
          expectedFromAverage: { reps: 0, count: 0 }
        });
      }
      
      const exercise = exerciseMap.get(log.exerciseName)!;
      
      if (!exercise.dailyData[logDate]) {
        exercise.dailyData[logDate] = { reps: 0, count: 0 };
      }
      
      exercise.dailyData[logDate].reps += log.reps || 0;
      exercise.dailyData[logDate].count += log.count || 0;
      
      exercise.totals.reps += log.reps || 0;
      exercise.totals.count += log.count || 0;
    });
    
    // Calculate lifetime averages
    exerciseMap.forEach((exercise, name) => {
      const exerciseLogs = allTimeLogs.filter((log: any) => log.exerciseName === name);
      
      if (exerciseLogs.length > 0) {
        // Get all dates and sort them
        const allDates = exerciseLogs.map((log: any) => moment(log.date));
        const firstDate = moment.min(allDates);
        const lastDate = moment.max(allDates);
        
        // Calculate total days between first and last entry (inclusive)
        const totalDays = lastDate.diff(firstDate, 'days') + 1;
        
        // Calculate totals
        let totalReps = 0;
        let totalCount = 0;
        
        exerciseLogs.forEach((log: any) => {
          totalReps += log.reps || 0;
          totalCount += log.count || 0;
        });
        
        // Average per day (total / days in span)
        exercise.lifetimeAverage.reps = totalDays > 0 ? Math.round(totalReps / totalDays) : 0;
        exercise.lifetimeAverage.count = totalDays > 0 ? Math.round(totalCount / totalDays) : 0;
        
        // Expected for this period (average per day × days)
        exercise.expectedFromAverage.reps = exercise.lifetimeAverage.reps * days;
        exercise.expectedFromAverage.count = exercise.lifetimeAverage.count * days;
      }
    });
    
    return Array.from(exerciseMap.values());
  }

  private async calculateOverallStats(userId: string, periodLogs: any[], allTimeLogs: any[], days: number): Promise<OverallStats> {
    // Calculate streaks
    const allLogs = await Log.find({ userId }).sort({ date: -1 });
    const streaks = this.calculateStreaks(allLogs);
    
    // Calculate period totals
    const periodTotal = { reps: 0, count: 0 };
    
    periodLogs.forEach(log => {
      periodTotal.reps += log.reps || 0;
      periodTotal.count += log.count || 0;
    });
    
    // Calculate lifetime averages
    let totalDays = 0;
    if (allTimeLogs.length > 0) {
      const allDates = allTimeLogs.map((log: any) => moment(log.date));
      const firstDate = moment.min(allDates);
      const lastDate = moment.max(allDates);
      
      // Calculate total days between first and last entry (inclusive)
      totalDays = lastDate.diff(firstDate, 'days') + 1;
    }
    
    let lifetimeTotalReps = 0;
    let lifetimeTotalCount = 0;
    
    allTimeLogs.forEach((log: any) => {
      lifetimeTotalReps += log.reps || 0;
      lifetimeTotalCount += log.count || 0;
    });
    
    const lifetimeAverage = {
      reps: totalDays > 0 ? Math.round(lifetimeTotalReps / totalDays) : 0,
      count: totalDays > 0 ? Math.round(lifetimeTotalCount / totalDays) : 0
    };
    
    // Expected from lifetime average
    const expectedTotal = (lifetimeAverage.reps + lifetimeAverage.count) * days;
    const actualTotal = periodTotal.reps + periodTotal.count;
    const comparisonPercent = expectedTotal > 0 ? Math.round(((actualTotal - expectedTotal) / expectedTotal) * 100) : 0;
    
    // Count unique workout days in period
    const uniquePeriodDays = new Set(periodLogs.map(log => moment(log.date).format('YYYY-MM-DD')));
    
    // Count unique exercises in period
    const uniqueExercises = new Set(periodLogs.map(log => log.exerciseName));
    
    return {
      currentStreak: streaks.current,
      longestStreak: streaks.longest,
      totalWorkoutDays: uniquePeriodDays.size,
      totalExercises: uniqueExercises.size,
      periodTotal,
      lifetimeAverage,
      comparisonPercent
    };
  }

  private calculateStreaks(logs: any[]): { current: number; longest: number } {
    if (logs.length === 0) return { current: 0, longest: 0 };
    
    // Get unique dates and sort them in descending order (newest first)
    const uniqueDates = [...new Set(logs.map(log => moment(log.date).format('YYYY-MM-DD')))]
      .sort((a, b) => moment(b).diff(moment(a)));
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = moment().format('YYYY-MM-DD');
    const yesterday = moment().subtract(1, 'day').format('YYYY-MM-DD');
    
    // Calculate current streak
    if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
      let checkDate = uniqueDates.includes(today) ? moment() : moment().subtract(1, 'day');
      
      for (const date of uniqueDates) {
        if (date === checkDate.format('YYYY-MM-DD')) {
          currentStreak++;
          checkDate = checkDate.subtract(1, 'day');
        } else if (moment(date).isBefore(checkDate, 'day')) {
          break;
        }
      }
    }
    
    // Calculate longest streak
    for (let i = 0; i < uniqueDates.length; i++) {
      tempStreak = 1;
      
      for (let j = i + 1; j < uniqueDates.length; j++) {
        const diff = moment(uniqueDates[j - 1]).diff(moment(uniqueDates[j]), 'days');
        if (diff === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    return { current: currentStreak, longest: longestStreak };
  }

}

