+++
tags = [
  "Zynqberry",
  "FPGA",
  "SoC",
  "Xilinx"
]
title = "Zynqberryをいじる"
image = ""
description = ""
googleAnalytics = "UA-83537418-2"
date = "2019-05-23T01:14:50+09:00"
categories = [
  "Tech",
]
copyright = "KFTamang All rights reserved"
subtitle = ""
author = "KFTamang"

+++

# Zynqberryとは

ZynqberryとはXilinx社が出しているSoC(System on Chip)であるZynqを搭載したボードコンピュータであり、ドイツのTranz社が販売している。
特徴としてはRasberry Pi Model 2 Bと同じ形状をしている。
ZynqはFGPAであるPL部とArmプロセッサであるPS部が一つのチップに乗っており、
FPGAとCPUのいいとこ取りで処理ができる。
Zynqの評価基板といえばZyboが最も有名であるが、Zyboより安くてなんとなくZynqberryを買ってしまった。
Tranz社の日本代理店である特殊電子株式会社以外にあんまり日本語のドキュメントが見つからないため、勉強ついでに参考となる情報をまとめていければと思う。

とりあえず参考文献をまとめていく。

# 参考文献
* Trenz社のRefference Design [TE0726 Reference Designs](https://wiki.trenz-electronic.de/display/PD/TE0726+Reference+Designs)

* Trenz社のTechnical Refference Manual [TE0726 TRM](https://wiki.trenz-electronic.de/display/PD/TE0726+TRM)

* Digikeyのチュートリアル [Getting Started with the ZynqBerry](https://www.digikey.com/eewiki/display/Motley/Getting+Started+with+the+ZynqBerry)
