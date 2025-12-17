import { useState, useEffect } from 'react'

const STORAGE_KEY = 'bosanski_jezik_progress'

export function useProgress() {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {
      completedLessons: [],
      quizScores: {},
      totalPoints: 0,
      streak: 0,
      lastActivity: null,
      achievements: []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  const saveQuizScore = (lessonId, score, totalQuestions) => {
    const percentage = Math.round((score / totalQuestions) * 100)
    const previousScore = progress.quizScores[lessonId]?.percentage || 0
    const isNewHighScore = percentage > previousScore
    
    // Calculate points earned
    let pointsEarned = score * 10
    if (percentage >= 90) pointsEarned += 50 // Bonus for excellent score
    else if (percentage >= 70) pointsEarned += 25 // Bonus for good score

    // Check for new achievements
    const newAchievements = [...progress.achievements]
    
    if (percentage === 100 && !newAchievements.includes('perfect_score')) {
      newAchievements.push('perfect_score')
    }
    if (Object.keys(progress.quizScores).length === 0 && !newAchievements.includes('first_quiz')) {
      newAchievements.push('first_quiz')
    }
    if (Object.keys(progress.quizScores).length >= 5 && !newAchievements.includes('five_quizzes')) {
      newAchievements.push('five_quizzes')
    }
    if (Object.keys(progress.quizScores).length >= 12 && !newAchievements.includes('all_a1')) {
      newAchievements.push('all_a1')
    }

    // Update streak
    const today = new Date().toDateString()
    const lastActivity = progress.lastActivity
    let newStreak = progress.streak
    
    if (lastActivity !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      if (lastActivity === yesterday.toDateString()) {
        newStreak += 1
        if (newStreak >= 7 && !newAchievements.includes('week_streak')) {
          newAchievements.push('week_streak')
        }
      } else if (lastActivity !== today) {
        newStreak = 1
      }
    }

    setProgress(prev => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [lessonId]: {
          score,
          totalQuestions,
          percentage,
          completedAt: new Date().toISOString(),
          attempts: (prev.quizScores[lessonId]?.attempts || 0) + 1
        }
      },
      completedLessons: prev.completedLessons.includes(lessonId) 
        ? prev.completedLessons 
        : [...prev.completedLessons, lessonId],
      totalPoints: isNewHighScore ? prev.totalPoints + pointsEarned : prev.totalPoints,
      streak: newStreak,
      lastActivity: today,
      achievements: newAchievements
    }))

    return { pointsEarned, isNewHighScore, percentage }
  }

  const getStars = (lessonId) => {
    const quiz = progress.quizScores[lessonId]
    if (!quiz) return 0
    if (quiz.percentage >= 90) return 3
    if (quiz.percentage >= 70) return 2
    if (quiz.percentage >= 50) return 1
    return 0
  }

  const getTotalStars = () => {
    let total = 0
    Object.keys(progress.quizScores).forEach(lessonId => {
      total += getStars(parseInt(lessonId))
    })
    return total
  }

  const getOverallProgress = () => {
    const totalLessons = 12
    const completed = progress.completedLessons.length
    return Math.round((completed / totalLessons) * 100)
  }

  const getAchievementInfo = (achievementId) => {
    const achievements = {
      'first_quiz': { name: 'Prvi korak', description: 'Završili ste prvi kviz!', emoji: '🎯' },
      'perfect_score': { name: 'Savršenstvo', description: '100% na kvizu!', emoji: '⭐' },
      'five_quizzes': { name: 'Na putu', description: 'Završili ste 5 kvizova', emoji: '🚀' },
      'all_a1': { name: 'A1 Majstor', description: 'Završili ste sve A1 lekcije', emoji: '🏆' },
      'week_streak': { name: 'Upornost', description: '7 dana zaredom učenja', emoji: '🔥' }
    }
    return achievements[achievementId] || { name: achievementId, description: '', emoji: '🎖️' }
  }

  const resetProgress = () => {
    setProgress({
      completedLessons: [],
      quizScores: {},
      totalPoints: 0,
      streak: 0,
      lastActivity: null,
      achievements: []
    })
  }

  return {
    progress,
    saveQuizScore,
    getStars,
    getTotalStars,
    getOverallProgress,
    getAchievementInfo,
    resetProgress
  }
}
