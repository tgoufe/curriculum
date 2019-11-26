# Node 识别验证码


## 前言

之前讲解过如何使用node生成各类验证码，上节课讲解了使用puppeteer破解简单滑块验证码，但还有一类验证码如何破解？


## 识别图片验证码

![](https://zhang-yue.oss-cn-beijing.aliyuncs.com/bingshan/截图1574065297470.png)

就识别来说现在'人工智能'这个流行的年代还是问题么？

捋一捋思路，如何识别图片验证码？

1. 使用puppeteer前往目标页
2. 截图
3. 截取验证码部分
4. 识别验证码
5. 填充


1，2，3，5步骤都已经将结果，只剩 识别验证码部分

## Tesseract

> 识别工具，目前由Google维护，支持中文，默认的识别率很低，特别是中文，但是可以自己提供样本，训练提高识别率。


说白了，刚开始，'他'就是一个傻子， 达不到人工智能的程度，需要我们对他进行训练。

但是我们可以使用它来进行一些简单的验证码识别


### 安装

以mac为例

```

brew install tesseract --all-languages

```

命令行使用方法：

```

tesseract imagename outputbase [-l lang] [-psm pagesegmode] [configfile…]

```

imagename为目标图片文件名，需加格式后缀；outputbase是转换结果文件名；lang是语言名称（在Tesseract-OCR中tessdata文件夹可看到以eng开头的语言文件eng.traineddata），如不标-l eng则默认为eng；pagesegmode则是生成结果显示相关配置。

例如：

```
tesseract 1.jpg result -psm 7 

tesseract code.jpg result -l chi_sim -psm 7 //  -l chi_sim 表示用简体中文字库, -psm 7 表示告诉tesseract code.jpg图片是一行文本,这个参数可以减少识别错误率，默认为3

```

这是他基础的使用，那么在node下如何使用？

我们使用tesseract.js

## tesseract.js


```javascript

import Tesseract from 'tesseract.js';

Tesseract.recognize(
  'https://tesseract.projectnaptha.com/img/eng_bw.png',
  'eng',
  { logger: m => console.log(m) }
).then(({ data: { text } }) => {
  console.log(text);
})

```
