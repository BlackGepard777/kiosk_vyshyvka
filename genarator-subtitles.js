// generate-subtitles.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const util = require('util');

const execPromise = util.promisify(exec);

// Конфігурація
const CONFIG = {
  videosDir: path.join(__dirname, 'data', 'uploads', 'videos'),
  subtitlesDir: path.join(__dirname, 'data', 'subtitles'),
  language: 'uk', // українська
  model: 'medium', // small, medium, large (чим більше - тим точніше, але повільніше)
  outputFormat: 'vtt'
};

// Кольори для консолі
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Перевірка чи встановлений Whisper
async function checkWhisperInstalled() {
  try {
    await execPromise('whisper --help');
    return true;
  } catch (error) {
    return false;
  }
}

// Отримання всіх відео файлів
function getVideoFiles() {
  if (!fs.existsSync(CONFIG.videosDir)) {
    throw new Error(`Папка відео не знайдена: ${CONFIG.videosDir}`);
  }

  const files = fs.readdirSync(CONFIG.videosDir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);
  });
}

// Генерація субтитрів для одного відео
async function generateSubtitlesForVideo(videoFile) {
  const videoPath = path.join(CONFIG.videosDir, videoFile);
  const videoName = path.parse(videoFile).name;
  
  log(`\n📹 Обробка відео: ${videoFile}`, 'cyan');
  log(`   Модель: ${CONFIG.model}, Мова: ${CONFIG.language}`, 'blue');

  try {
    // Створюємо папку для субтитрів якщо не існує
    if (!fs.existsSync(CONFIG.subtitlesDir)) {
      fs.mkdirSync(CONFIG.subtitlesDir, { recursive: true });
    }

    // Команда Whisper
    const command = `whisper "${videoPath}" --language ${CONFIG.language} --model ${CONFIG.model} --output_format ${CONFIG.outputFormat} --output_dir "${CONFIG.subtitlesDir}"`;
    
    log(`   ⏳ Генерація субтитрів... (це може зайняти кілька хвилин)`, 'yellow');
    
    const startTime = Date.now();
    const { stdout, stderr } = await execPromise(command);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Whisper створює файл з назвою відео, перейменовуємо його
    const whisperOutput = path.join(CONFIG.subtitlesDir, `${videoName}.vtt`);
    const finalOutput = path.join(CONFIG.subtitlesDir, `${videoName}-uk.vtt`);
    
    if (fs.existsSync(whisperOutput)) {
      // Читаємо згенерований файл
      let vttContent = fs.readFileSync(whisperOutput, 'utf8');
      
      // Перевіряємо формат
      if (!vttContent.startsWith('WEBVTT')) {
        vttContent = 'WEBVTT\n\n' + vttContent;
      }
      
      // Зберігаємо з новою назвою
      fs.writeFileSync(finalOutput, vttContent, 'utf8');
      
      // Видаляємо оригінальний файл якщо він відрізняється
      if (whisperOutput !== finalOutput && fs.existsSync(whisperOutput)) {
        fs.unlinkSync(whisperOutput);
      }
      
      log(`   ✅ Успішно! Збережено: ${path.basename(finalOutput)}`, 'green');
      log(`   ⏱️  Час обробки: ${duration} секунд`, 'blue');
      
      // Показуємо перші кілька рядків субтитрів
      const lines = vttContent.split('\n').slice(0, 8).join('\n');
      log(`   📝 Попередній перегляд:\n${lines}...`, 'blue');
      
      return { success: true, file: videoFile, outputFile: finalOutput, duration };
    } else {
      throw new Error('Файл субтитрів не створено');
    }
    
  } catch (error) {
    log(`   ❌ Помилка: ${error.message}`, 'red');
    if (error.stderr) {
      log(`   Деталі: ${error.stderr}`, 'red');
    }
    return { success: false, file: videoFile, error: error.message };
  }
}

// Генерація config.json
function generateConfigJson(results) {
  const configPath = path.join(CONFIG.subtitlesDir, 'config.json');
  
  const videos = results
    .filter(r => r.success)
    .map((result, index) => {
      const videoName = path.parse(result.file).name;
      return {
        id: (index + 1).toString(),
        src: `/uploads/videos/${result.file}`,
        title: `Відео ${index + 1}`,
        category: 'all',
        subtitles: [
          {
            language: 'uk',
            label: 'Українська',
            src: `/api/subtitles/${path.basename(result.outputFile)}`
          }
        ]
      };
    });

  const config = { videos };
  
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  log(`\n✅ Config.json створено: ${configPath}`, 'green');
  log(`   Додано ${videos.length} відео з субтитрами`, 'blue');
}

// Головна функція
async function main() {
  log('\n🎬 Генератор субтитрів для відео', 'cyan');
  log('=' .repeat(50), 'cyan');

  // Перевірка Whisper
  log('\n🔍 Перевірка залежностей...', 'yellow');
  const whisperInstalled = await checkWhisperInstalled();
  
  if (!whisperInstalled) {
    log('\n❌ Whisper не встановлений!', 'red');
    log('\nДля встановлення виконайте:', 'yellow');
    log('  pip install openai-whisper', 'cyan');
    log('\nАбо з conda:', 'yellow');
    log('  conda install -c conda-forge openai-whisper', 'cyan');
    process.exit(1);
  }
  
  log('✅ Whisper встановлений', 'green');

  // Отримання списку відео
  log('\n📂 Пошук відео файлів...', 'yellow');
  let videoFiles;
  
  try {
    videoFiles = getVideoFiles();
  } catch (error) {
    log(`\n❌ ${error.message}`, 'red');
    process.exit(1);
  }

  if (videoFiles.length === 0) {
    log('\n⚠️  Відео файли не знайдені!', 'yellow');
    log(`Перевірте папку: ${CONFIG.videosDir}`, 'blue');
    process.exit(0);
  }

  log(`✅ Знайдено відео: ${videoFiles.length}`, 'green');
  videoFiles.forEach((file, index) => {
    log(`   ${index + 1}. ${file}`, 'blue');
  });

  // Обробка всіх відео
  log('\n🚀 Початок обробки...', 'yellow');
  const results = [];

  for (let i = 0; i < videoFiles.length; i++) {
    const result = await generateSubtitlesForVideo(videoFiles[i]);
    results.push(result);
  }

  // Підсумок
  log('\n' + '='.repeat(50), 'cyan');
  log('📊 Підсумок обробки:', 'cyan');
  log('='.repeat(50), 'cyan');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  log(`\n✅ Успішно: ${successful}`, 'green');
  log(`❌ Помилки: ${failed}`, failed > 0 ? 'red' : 'green');

  if (successful > 0) {
    const totalTime = results
      .filter(r => r.success)
      .reduce((sum, r) => sum + parseFloat(r.duration || 0), 0)
      .toFixed(2);
    log(`⏱️  Загальний час: ${totalTime} секунд`, 'blue');
    
    // Генерація config.json
    generateConfigJson(results);
  }

  if (failed > 0) {
    log('\n❌ Файли з помилками:', 'red');
    results.filter(r => !r.success).forEach(r => {
      log(`   - ${r.file}: ${r.error}`, 'red');
    });
  }

  log('\n✨ Готово!', 'green');
  log(`📁 Субтитри збережено в: ${CONFIG.subtitlesDir}\n`, 'blue');
}

// Запуск
main().catch(error => {
  log(`\n❌ Критична помилка: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});