---
title: 神奇的FFMPEG
date: 2019-08-06 18:00:00
tags:
    - video
categories: JavaScript
---

FFMPEG或许大家没有听过，但是暴风影音，QQ影音，VLC，格式工厂...

<!--more-->

# 前言

FFMPEG或许大家没有听过，但是暴风影音，QQ影音，VLC，格式工厂...

很多人应该和我刚接触它时候有同样的感觉，这个东西和前端有什么关系？

使用FFMPEG能干些什么？

# 功能介绍


## 视频采集功能
```
ffmpeg -f avfoundation -framerate 30  -i "0" -vcodec h264 -f flv rtmp://localhost:1935/live/movie
```
- -f 强制输入或输出文件格式。通常会自动检测输入文件的格式，并从输出文件的文件扩展名中猜测，因此在大多数情况下不需要此选项。
- -framerate 同 -r 控制fps 帧速率

##  视频截图功能
```
ffmpeg -i 0723.flv -ss 60 -f image2 test60.jpeg
```

- -i ：代表输入流，后面接视频的物理路径，可以是MP4、AVI等                                                                                                
- -ss：代表要截取的的图片在视频中的位置，后面接数字，秒为单位
- -f ：代表输出图片，后面接image2  


##  视频格式转换
```
ffmpeg -i 0723.flv -vf "movie=logo.png[watermark];[in][watermark] overlay=main_w-overlay_w-10:main_h-overlay_h-10[out] " output.mp4
```

##  视频/图片增加水印

- 图片水印
```
ffmpeg -i  0723.flv -vf "movie=wenzi.png[watermark];[in][watermark] overlay=main_w-overlay_w-10:main_h-overlay_h-10[out] " output.mp4
```

- -i: 输入
- 0723.flv 视频源
- vf 滤镜相关，视频裁剪，水印在这里完成
- overlay 水印参数
- main_w-overlay_w_10 水印在x轴位置，x=main_w-overlay_w-10
- main_h-overlay_h-10 水印在y轴的位置

```
ffmpeg -i 0723.flv -i iQIYI_logo.png -filter_complex overlay output.mp4
```
  
- -i 输入
- -filter_complex 滤镜 解决复杂滤镜 多水印问题
- overlay 默认参数
- output 输出
- 文字水印
  
```
ffmpeg -i 0723.flv -vf "drawtext=fontfile=simhei.ttf: text=‘冰山工作室’:x=10:y=10:fontsize=24:fontcolor=white:shadowy=2" 冰山.flv
```
或
```
ffmpeg -i 0723.flv -b:v 2M -vf "drawtext=fontfile=simhei.ttf: text=‘冰山工作室’:x=10:y=10:fontsize=24:fontcolor=white:shadowy=2" 冰山.flv
```
二者区别在哪？

- -b: 设置比特率 调节画质
  

##  将图片序列合成视频
```
ffmpeg -f image2 -i image%d.jpg binshan.mp4
```

##  将视频分解成图片序列
```
ffmpeg -i bingshan.mp4 image%d.jpg
```

##  从视频抽出声音.并存为Mp3

```
ffmpeg -i source_video.avi -vn -ar 44100 -ac 2 -ab 192 -f mp3 sound.mp3
```

-  源视频：source_video.avi
-  音频位率：192kb/s
-  输出格式：mp3
-  生成的声音：sound.mp3

##  合成视频和音频
```
ffmpeg -i son.wav -i video_origine.avi video_finale.mp4
```

##  从flv提取mp3

```
ffmpeg -i source.flv -ab 128k dest.mp3
```


a) 通用选项

-L license

-h 帮助

-fromats 显示可用的格式，编解码的，协议的...

-f fmt 强迫采用格式fmt

-I filename 输入文件

-y 覆盖输出文件

-t duration 设置纪录时间 hh:mm:ss[.xxx]格式的记录时间也支持

-ss position 搜索到指定的时间 [-]hh:mm:ss[.xxx]的格式也支持

-title string 设置标题

-author string 设置作者

-copyright string 设置版权

-comment string 设置评论

-target type 设置目标文件类型(vcd,svcd,dvd) 所有的格式选项（比特率，编解码以及缓冲区大小）自动设置，只需要输入如下的就可以了：ffmpeg -i myfile.avi -target vcd /tmp/vcd.mpg

-hq 激活高质量设置

-itsoffset offset 设置以秒为基准的时间偏移，该选项影响所有后面的输入文件。该偏移被加到输入文件的时戳，定义一个正偏移意味着相应的流被延迟了 offset秒。 [-]hh:mm:ss[.xxx]的格式也支持

b) 视频选项

-b bitrate 设置比特率，缺省200kb/s

-r fps 设置帧频 缺省25

-s size 设置帧大小 格式为WXH 缺省160X128.下面的简写也可以直接使用：

Sqcif 128X96 qcif 176X144 cif 252X288 4cif 704X576

-aspect aspect 设置横纵比 4:3 16:9 或 1.3333 1.7777

-croptop size 设置顶部切除带大小 像素单位

-cropbottom size –cropleft size –cropright size

-padtop size 设置顶部补齐的大小 像素单位

-padbottom size –padleft size –padright size –padcolor color 设置补齐条颜色(hex,6个16进制的数，红:绿:兰排列，比如 000000代表黑色)

-vn 不做视频记录

-bt tolerance 设置视频码率容忍度kbit/s

-maxrate bitrate设置最大视频码率容忍度

-minrate bitreate 设置最小视频码率容忍度

-bufsize size 设置码率控制缓冲区大小

-vcodec codec 强制使用codec编解码方式。如果用copy表示原始编解码数据必须被拷贝。

-sameq 使用同样视频质量作为源（VBR）

-pass n 选择处理遍数（1或者2）。两遍编码非常有用。第一遍生成统计信息，第二遍生成精确的请求的码率

-passlogfile file 选择两遍的纪录文件名为file

c)高级视频选项

-g gop_size 设置图像组大小

-intra 仅适用帧内编码

-qscale q 使用固定的视频量化标度(VBR)

-qmin q 最小视频量化标度(VBR)

-qmax q 最大视频量化标度(VBR)

-qdiff q 量化标度间最大偏差 (VBR)

-qblur blur 视频量化标度柔化(VBR)

-qcomp compression 视频量化标度压缩(VBR)

-rc_init_cplx complexity 一遍编码的初始复杂度

-b_qfactor factor 在p和b帧间的qp因子

-i_qfactor factor 在p和i帧间的qp因子

-b_qoffset offset 在p和b帧间的qp偏差

-i_qoffset offset 在p和i帧间的qp偏差

-rc_eq equation 设置码率控制方程 默认tex^qComp

-rc_override override 特定间隔下的速率控制重载

-me method 设置运动估计的方法 可用方法有 zero phods log x1 epzs(缺省) full

-dct_algo algo 设置dct的算法 可用的有 0 FF_DCT_AUTO 缺省的DCT 1 FF_DCT_FASTINT 2 FF_DCT_INT 3 FF_DCT_MMX 4 FF_DCT_MLIB 5 FF_DCT_ALTIVEC

-idct_algo algo 设置idct算法。可用的有 0 FF_IDCT_AUTO 缺省的IDCT 1 FF_IDCT_INT 2 FF_IDCT_SIMPLE 3 FF_IDCT_SIMPLEMMX 4 FF_IDCT_LIBMPEG2MMX 5 FF_IDCT_PS2 6 FF_IDCT_MLIB 7 FF_IDCT_ARM 8 FF_IDCT_ALTIVEC 9 FF_IDCT_SH4 10 FF_IDCT_SIMPLEARM

-er n 设置错误残留为n 1 FF_ER_CAREFULL 缺省 2 FF_ER_COMPLIANT 3 FF_ER_AGGRESSIVE 4 FF_ER_VERY_AGGRESSIVE

-ec bit_mask 设置错误掩蔽为bit_mask,该值为如下值的位掩码 1 FF_EC_GUESS_MVS (default=enabled) 2 FF_EC_DEBLOCK (default=enabled)

-bf frames 使用frames B 帧，支持mpeg1,mpeg2,mpeg4

-mbd mode 宏块决策 0 FF_MB_DECISION_SIMPLE 使用mb_cmp 1 FF_MB_DECISION_BITS 2 FF_MB_DECISION_RD

-4mv 使用4个运动矢量 仅用于mpeg4

-part 使用数据划分 仅用于mpeg4

-bug param 绕过没有被自动监测到编码器的问题

-strict strictness 跟标准的严格性

-aic 使能高级帧内编码 h263+

-umv 使能无限运动矢量 h263+

-deinterlace 不采用交织方法

-interlace 强迫交织法编码仅对mpeg2和mpeg4有效。当你的输入是交织的并且你想要保持交织以最小图像损失的时候采用该选项。可选的方法是不交织，但是损失更大

-psnr 计算压缩帧的psnr

-vstats 输出视频编码统计到vstats_hhmmss.log

-vhook module 插入视频处理模块 module 包括了模块名和参数，用空格分开

D)音频选项

-ab bitrate 设置音频码率

-ar freq 设置音频采样率

-ac channels 设置通道 缺省为1

-an 不使能音频纪录

-acodec codec 使用codec编解码

E)音频/视频捕获选项

-vd device 设置视频捕获设备。比如/dev/video0

-vc channel 设置视频捕获通道 DV1394专用

-tvstd standard 设置电视标准 NTSC PAL(SECAM)

-dv1394 设置DV1394捕获

-av device 设置音频设备 比如/dev/dsp

F)高级选项

-map file:stream 设置输入流映射

-debug 打印特定调试信息

-benchmark 为基准测试加入时间

-hex 倾倒每一个输入包

-bitexact 仅使用位精确算法 用于编解码测试

-ps size 设置包大小，以bits为单位

-re 以本地帧频读数据，主要用于模拟捕获设备

-loop 循环输入流（只工作于图像流，用于ffserver测试）








