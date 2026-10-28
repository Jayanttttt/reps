import { jsPDF } from 'jspdf';
import {
  WorkoutSession,
  MonthlyReport,
  ExerciseLog,
} from '../types';
import { formatDate, formatMonth } from './dateUtils';
import { BODY_PART_LABELS } from '../types';

/**
 * Generate PDF of workout records
 */
export function generateRecordsPDF(
  sessions: WorkoutSession[],
  title: string = 'Workout Records'
): void {
  const doc = new jsPDF();
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(title, pageWidth / 2, y, { align: 'center' });
  y += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Sort sessions by date descending
  const sorted = [...sessions].sort((a, b) => b.date.localeCompare(a.date));

  for (const session of sorted) {
    // Check if we need a new page
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    // Session header
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const bodyParts = session.bodyParts.map(bp => BODY_PART_LABELS[bp]).join(', ');
    doc.text(`${formatDate(session.date)} — ${bodyParts}`, margin, y);
    y += 7;

    // Exercises
    for (const exercise of session.exercises) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`  ${exercise.exerciseName} (${BODY_PART_LABELS[exercise.bodyPart]})`, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const completedSets = exercise.sets.filter(s => s.isCompleted);
      for (const set of completedSets) {
        doc.text(`    Set ${set.setNumber}: ${set.weight} kg × ${set.reps} reps`, margin + 5, y);
        y += 4;
      }

      if (exercise.notes) {
        doc.setFontSize(8);
        doc.text(`    Note: ${exercise.notes}`, margin + 5, y);
        y += 4;
      }

      y += 2;
    }

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  doc.save(`${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
}

/**
 * Generate PDF of monthly report
 */
export function generateReportPDF(report: MonthlyReport): void {
  const doc = new jsPDF();
  let y = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`Monthly Report — ${formatMonth(report.month)}`, pageWidth / 2, y, { align: 'center' });
  y += 15;

  // Summary stats
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Summary', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const stats = [
    `Total Workouts: ${report.totalWorkouts}`,
    `Total Exercises Performed: ${report.totalExercises}`,
    `Total Sets: ${report.totalSets}`,
    `Total Reps: ${report.totalReps}`,
    `Total Volume: ${report.totalVolume.toLocaleString()} kg`,
    `Overall Strength Change: ${report.overallStrengthChange > 0 ? '+' : ''}${report.overallStrengthChange}%`,
  ];

  for (const stat of stats) {
    doc.text(`  ${stat}`, margin, y);
    y += 6;
  }
  y += 5;

  // Strength change highlight
  if (report.overallStrengthChange !== 0) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const changeText = report.overallStrengthChange > 0
      ? `Improved strength by +${report.overallStrengthChange}% from last month!`
      : `Strength shifted by ${report.overallStrengthChange}% from last month.`;
    doc.text(changeText, margin, y);
    y += 10;
  }

  // Exercise progress
  if (report.exerciseProgress.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Exercise Progress', margin, y);
    y += 8;

    for (const progress of report.exerciseProgress) {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`  ${progress.exerciseName}`, margin, y);
      y += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      const details = [
        `    Weight: ${progress.startWeight}kg → ${progress.endWeight}kg (${progress.weightChange >= 0 ? '+' : ''}${progress.weightChange}kg, ${progress.weightChangePercent >= 0 ? '+' : ''}${progress.weightChangePercent}%)`,
        `    Volume: ${progress.totalVolume.toLocaleString()} kg | Sets: ${progress.totalSets} | Reps: ${progress.totalReps}`,
      ];

      for (const detail of details) {
        doc.text(detail, margin, y);
        y += 4;
      }
      y += 3;
    }
  }

  // Body part breakdown
  y += 5;
  if (y > 240) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Body Part Breakdown', margin, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  for (const [bodyPart, data] of Object.entries(report.bodyPartBreakdown)) {
    const label = BODY_PART_LABELS[bodyPart as keyof typeof BODY_PART_LABELS] || bodyPart;
    doc.text(`  ${label}: ${data.sets} sets, ${data.volume.toLocaleString()} kg volume`, margin, y);
    y += 5;
  }

  doc.save(`Monthly_Report_${report.month}.pdf`);
}
