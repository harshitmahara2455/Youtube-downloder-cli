# 📖 Documentation - Youtube Downloader CLI
**Overview**

**Youtube** **Downloader** **CLI** is a simple and user friendly command line tool built on top of [yt-dlp](  https://github.com/yt-dlp/yt-dlp)

It allows you to easily download single videos or entire playlist from Youtube with porgress bars and quality selection 

# ✨ Features 

* Download **single videos** or entire **playlist** 

* Supports **audio-Only** mode 

* Real time progress bar with **speed** 

* Built with **Node.js**+**yt-dlp**

#  ✨Things used--

* **Commander**- used to build command-line-interface 
* **Cli-progress** - for progress bar in the terminal 

# 📦 Installation --

### 1.Clone from Github


```bash 
git clone 
cd  youtube-dl-cli
npm install 
```
### 2.Install Globally(Dev mode)
```bash
npm link 
```
now you can  run :
```bash 
yt-dl <url>
```
# 🚀 Usage 
### Download a single video 
```bash
yt-dl https://youtube.com/watch?v=abcd1234 -q high -o "./downloads/video.mp4"
```
### Download a playlist 
```bash 
yt-dl https://youtube.com/playlist?list=abcd1234 -q low -d "./downloads"
```
# ⚙️ Options

### To choose Quality 

from high,low,audio

```bash
-q high
```

### Output file path (for single video )
```bash
-o ./video.mp4
```
### Output directory (for playlist )
```bash 
-d ./downloads
```

# 👨‍💻  Built by Harshit 

### Feel free to connect on [Linkdin](https://www.linkedin.com/in/harshit-mahara-8892a0270/)