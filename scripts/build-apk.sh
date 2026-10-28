#!/usr/bin/env bash
set -e

echo "=== 1. Building Web Assets ==="
npm run build

echo "=== 2. Syncing Capacitor Android ==="
npx cap sync android

echo "=== 3. Compiling Android APK ==="
export JAVA_HOME="/home/jayant/.local/jdk21"
export ANDROID_HOME="/home/jayant/.local/android-sdk"
export ANDROID_SDK_ROOT="/home/jayant/.local/android-sdk"
export PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"

cd android
./gradlew assembleDebug
cd ..

echo "=== 4. Copying APK to All Accessible Locations ==="
cp android/app/build/outputs/apk/debug/app-debug.apk /home/jayant/Desktop/reps/REPS-FitnessTracker.apk
cp android/app/build/outputs/apk/debug/app-debug.apk /home/jayant/Desktop/reps/public/REPS-FitnessTracker.apk
cp android/app/build/outputs/apk/debug/app-debug.apk /home/jayant/Desktop/REPS-FitnessTracker.apk
cp android/app/build/outputs/apk/debug/app-debug.apk /home/jayant/Downloads/REPS-FitnessTracker.apk

chmod 644 /home/jayant/Desktop/reps/REPS-FitnessTracker.apk
chmod 644 /home/jayant/Desktop/reps/public/REPS-FitnessTracker.apk
chmod 644 /home/jayant/Desktop/REPS-FitnessTracker.apk
chmod 644 /home/jayant/Downloads/REPS-FitnessTracker.apk

echo "Done! APK available at:"
echo "1. Direct Browser Download: http://192.168.1.48:5173/REPS-FitnessTracker.apk"
echo "2. Project Root: /home/jayant/Desktop/reps/REPS-FitnessTracker.apk"
echo "3. Desktop: /home/jayant/Desktop/REPS-FitnessTracker.apk"
echo "4. Downloads: /home/jayant/Downloads/REPS-FitnessTracker.apk"
