# Safari iPhone 视频格式检查工具
# 使用方法: .\check-video.ps1 -VideoPath "videos\your-video.mp4"

param(
    [Parameter(Mandatory=$true)]
    [string]$VideoPath
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Safari iPhone 视频兼容性检查" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查文件是否存在
if (-not (Test-Path $VideoPath)) {
    Write-Host "❌ 错误: 文件不存在: $VideoPath" -ForegroundColor Red
    exit 1
}

# 检查 FFmpeg 是否安装
$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
$ffprobe = Get-Command ffprobe -ErrorAction SilentlyContinue

if (-not $ffmpeg -or -not $ffprobe) {
    Write-Host "⚠️  警告: 未检测到 FFmpeg" -ForegroundColor Yellow
    Write-Host "   请安装 FFmpeg 以获取详细检查: https://ffmpeg.org/download.html" -ForegroundColor Yellow
    Write-Host ""
    
    # 基础文件检查
    $fileInfo = Get-Item $VideoPath
    Write-Host "文件信息:" -ForegroundColor Green
    Write-Host "  文件名: $($fileInfo.Name)"
    Write-Host "  大小: $([math]::Round($fileInfo.Length / 1MB, 2)) MB"
    Write-Host "  扩展名: $($fileInfo.Extension)"
    Write-Host ""
    Write-Host "⚠️  无法验证视频编码格式，请确保使用 H.264 + AAC" -ForegroundColor Yellow
    exit 0
}

# 使用 ffprobe 检查视频信息
Write-Host "正在分析视频文件..." -ForegroundColor Green
Write-Host ""

# 获取视频流信息
$videoInfo = & ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,codec_tag_string,profile,pix_fmt,width,height,duration,bit_rate -of json $VideoPath | ConvertFrom-Json

# 获取音频流信息
$audioInfo = & ffprobe -v error -select_streams a:0 -show_entries stream=codec_name,codec_tag_string,channels,sample_rate,bit_rate -of json $VideoPath | ConvertFrom-Json

# 获取格式信息
$formatInfo = & ffprobe -v error -show_entries format=format_name,duration,size,bit_rate -of json $VideoPath | ConvertFrom-Json

# 显示结果
Write-Host "📹 视频流信息:" -ForegroundColor Green
if ($videoInfo.streams) {
    $v = $videoInfo.streams[0]
    Write-Host "  编码器: $($v.codec_name) $(if($v.codec_tag_string -ne $v.codec_name){"($($v.codec_tag_string))"})"
    Write-Host "  Profile: $($v.profile)"
    Write-Host "  像素格式: $($v.pix_fmt)"
    Write-Host "  分辨率: $($v.width)x$($v.height)"
    Write-Host "  时长: $([math]::Round([double]$v.duration, 2)) 秒"
    Write-Host "  码率: $([math]::Round([double]$v.bit_rate / 1000, 0)) kbps"
} else {
    Write-Host "  ❌ 未检测到视频流!" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔊 音频流信息:" -ForegroundColor Green
if ($audioInfo.streams) {
    $a = $audioInfo.streams[0]
    Write-Host "  编码器: $($a.codec_name) $(if($a.codec_tag_string -ne $a.codec_name){"($($a.codec_tag_string))"})"
    Write-Host "  声道: $($a.channels)"
    Write-Host "  采样率: $($a.sample_rate) Hz"
    Write-Host "  码率: $([math]::Round([double]$a.bit_rate / 1000, 0)) kbps"
} else {
    Write-Host "  ❌ 未检测到音频流!" -ForegroundColor Red
}

Write-Host ""
Write-Host "📦 容器格式:" -ForegroundColor Green
$f = $formatInfo.format
Write-Host "  格式: $($f.format_name)"
Write-Host "  文件大小: $([math]::Round([double]$f.size / 1MB, 2)) MB"
Write-Host "  总码率: $([math]::Round([double]$f.bit_rate / 1000, 0)) kbps"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  兼容性检查结果" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查兼容性
$issues = @()
$warnings = @()

# 检查视频编码
if ($v.codec_name -ne 'h264') {
    $issues += "视频编码为 $($v.codec_name)，Safari 需要 H.264"
}

# 检查 Profile
if ($v.profile -and $v.profile -notmatch 'Baseline|Constrained Baseline') {
    $warnings += "视频 Profile 为 $($v.profile)，建议使用 Baseline 以获得最佳兼容性"
}

# 检查像素格式
if ($v.pix_fmt -ne 'yuv420p') {
    $issues += "像素格式为 $($v.pix_fmt)，Safari 需要 yuv420p"
}

# 检查音频编码
if ($a.codec_name -ne 'aac') {
    $issues += "音频编码为 $($a.codec_name)，Safari 需要 AAC"
}

# 检查 moov atom（快速启动）
$moovCheck = & ffprobe -v error -show_entries format=format_name -of csv $VideoPath 2>&1
if ($moovCheck -match 'error') {
    $warnings += "无法验证 moov atom 位置，建议使用 -movflags +faststart 重新编码"
}

# 显示结果
if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✅ 完美兼容! 此视频可以在 Safari iPhone 上正常播放。" -ForegroundColor Green
} else {
    if ($issues.Count -gt 0) {
        Write-Host "❌ 发现兼容性问题:" -ForegroundColor Red
        foreach ($issue in $issues) {
            Write-Host "   • $issue" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "⚠️  警告:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "   • $warning" -ForegroundColor Yellow
        }
    }
    
    Write-Host ""
    Write-Host "🔧 修复建议:" -ForegroundColor Cyan
    Write-Host "   运行以下命令重新编码视频:" -ForegroundColor White
    Write-Host ""
    Write-Host "   ffmpeg -i `"$VideoPath`" `"`
    Write-Host "     -c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p `"`
    Write-Host "     -movflags +faststart `"`
    Write-Host "     -c:a aac -b:a 128k -ar 44100 `"`
    Write-Host "     -crf 23 -preset fast `"`
    Write-Host "     output-safari.mp4" -ForegroundColor Green
}

Write-Host ""
