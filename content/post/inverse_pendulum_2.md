+++
categories = [
  "Tech",
]
googleAnalytics = "UA-83537418-2"
image = ""
description = ""
subtitle = ""
date = "2019-04-23T14:04:18+09:00"
copyright = "KFTamang All rights reserved"
title = "モータドライバのPWM制御のテスト"
author = "KFTamang"
tags = [
  "倒立振子",
]

+++


# これまで

[前回の記事](https://kftamang.github.io/post/inverse_pendulum_1/)でモータドライバIC DRV8835の動作テストを行い、
無事にDCモータ(FA-130)が駆動できることを確認しました。
しかしこのままではモータの動作は順方向逆方向に最大出力の運転しかできません。
倒立振子を製作するには、0%から100%の間で出力を連続的に変化させてモータを駆動する必要があります。

今回はPWM方式を用いてモータの出力を変化させるテストをしました。

# PWM方式

PWMとはPulse Width Modulationの略で、High/Lowの2値しかとらない信号線一本で連続的な量を送る変調方式の一種です。
周期的なパルスを送信する際に、パルスのDuty比(Highである時間とLowである時間の比)によって連続量を表現します。
受け手の時間応答よりも十分早い周波数でパルスを送ることで、実効的には時間平均が取られた値を送ることができます。
今回使用したArduino nanoではPWMの周波数は約490Hzであり、モータの応答に対して十分早いため回転スピードを連続的に変化させることができます。


# 実験系

PWM信号を送るため、Arduino nanoを使用しました。
ArduinoはPWM信号を送るためのanalogWrite()関数が用意されており、
簡単に特定のピンから約490HzのPWM信号を出力できます。（一部のピンでは倍の周波数で出る。）
またDRV8835をPHASE/ENABLEモードで動作させるにあたり、順転逆転の制御のためのPHASE信号も必要となります。

Arduino nanoの3.3V,GND,PIN9,PIN8をそれぞれDRV8835のVCC,GND,AENABLE,APHASEにつなぎました。
PHASE/ENABLEモードで動作させるためDRV8835のMODEピンは3.3Vに直結します。

DRV8835のVM,GND,AOUT1/AOUT2を電池、モータに繋いで準備完了です。


# テスト用のArduinoスケッチ

以下にテストに使用したスケッチを置いておきます。
出力を0%からほぼ100%に上げ、また0%に戻すのを順転方向と逆転方向について交互に繰り返すだけです。

```cpp:PWM_test
int pwm_out = 9;
int phase = 8;
void setup() {
  // put your setup code here, to run once:
  pinMode(pwm_out, OUTPUT);
  pinMode(phase, OUTPUT);
  
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(phase, HIGH);
  for (int i = 0; i < 25; ++i) {
    analogWrite(pwm_out, i * 10);
    delay(200);
  }
  for (int i = 25; i > 0; --i) {
    analogWrite(pwm_out, i * 10);
    delay(200);
  }
  digitalWrite(phase, LOW);
  for (int i = 0; i < 25; ++i) {
    analogWrite(pwm_out, i * 10);
    delay(200);
  }
  for (int i = 25; i > 0; --i) {
    analogWrite(pwm_out, i * 10);
    delay(200);
  }
}

```

# 結果

意図したとおりにモータの出力が変化してくれます。
車輪に目印を貼って回転速度がわかる様にすればよかったですね。



# 次回予告

次はいよいよ傾きセンサと組み合わせていきたいと思います。



