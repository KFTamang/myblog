+++
image = ""
tags = [
  "倒立振子",
]
categories = [
  "Tech",
]
title = "[倒立振子] 角度の推定"
subtitle = ""
date = "2019-05-04T11:41:00+09:00"
description = ""
googleAnalytics = "UA-83537418-2"
copyright = "KFTamang All rights reserved"
author = "KFTamang"

+++

# 前回までのまとめ

前回は倒立振子の完成に向けて駆動系（モータ、ギアボックス）の製作を行なった。
そのとき次回は全体のまとめについて記事にすると言ったが、
角度の推定だけでひとつのエントリにした方が良さそうなので分割することにした。

# 姿勢の取得

倒立振子が自立するには垂直軸に対する自分の角度を知る必要がある。
このためにジャイロセンサ・加速度センサ複合モジュールである
[GY-521 MPU-60503軸ジャイロ+3軸加速度センサ](https://www.amazon.co.jp/gp/product/B00K67X810/ref=ppx_yo_dt_b_search_asin_title?ie=UTF8&psc=1)
を用いた。
GY-521はジャイロ・加速度センサチップであるMPU-6050にパスコン、3端子レギュレータなどを合わせて2.54mmピッチに変換したものである。
ArduinoとはI2C方式で通信する。

ジャイロセンサにより3軸の角速度、加速度センサにより同じく3軸の加速度が取得できる。
ジャイロセンサのみ、または加速度センサのみで現在の角度を求めることも可能ではあるが、
後述する通り両者を組み合わせることで精度を向上させることができる。

## 角度の推定方法

ジャイロセンサは角速度を測定するため、測定値を積分することで始点からの角度変化を求めることができる。
しかしこの方法では測定値を足しつづけるため、誤差が蓄積し推定値が真の値からどんどんずれてしまう。

加速度センサは重力加速度の方向がわかるため、垂直軸からの離角が直接計算できる。
しかし加速度センサはノイズが大きく、瞬間的には角度の計算値は大きく揺れる。
また水平方向に加速運動をしている場合、慣性力と重力加速度の合力が測定されるため計算値に誤差が乗る。

そこで今回は相補フィルターを用いてジャイロセンサと加速度センサの値から角度を推定した。

相補フィルタについては各自参照してもらいたいが、長期トレンドとしては加速度センサが、短期トレンドとしてはジャイロセンサが大きな影響を与えるようになっている。

ジャイロセンサ・加速度センサのテストに用いたコードが以下である。

```gyro_test
// MPU-6050 Short Example Sketch
// By Arduino User JohnChi
// August 17, 2014
// Public Domain
#include<Wire.h>

#define dt (0.030)
#define K (0.95)



float angle = 0;
float angle_raw = 0;
float angle_com = 0;
float angle_gyro = 0;
float gyro_offset = 0.0;
float angle_offset = 0.0;

int count = 0;

const int MPU_addr=0x68;  // I2C address of the MPU-6050
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;
void setup(){
  Wire.begin();
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
  Serial.begin(115200);

  // canceling gyro offset
  for(int i=0;i<100;++i){
    Wire.beginTransmission(MPU_addr);
    Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)  
    Wire.endTransmission(false);
    Wire.requestFrom(MPU_addr,14,true);  // request a total of 14 registers
    AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)     
    AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
    AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
    Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
    GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
    GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
    GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
    gyro_offset += GyZ;
    angle_offset += atan2(AcX,AcY)*180.0/3.14 + 90.0;
  
  }
  gyro_offset /= 100.0;
  angle_offset /= 100.0;
  
  Serial.print(gyro_offset);
  Serial.print("\n");
  
}

void loop(){
  ++count;  
  //angle = get_angle();

  Wire.beginTransmission(MPU_addr);
  Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_addr,14,true);  // request a total of 14 registers
  AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)     
  AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
  AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
  Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
  GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
  GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
  GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)


  angle = atan2(AcX,AcY)*180.0/3.14 + 90.0 - angle_offset;

  float d_gyro = (GyZ-gyro_offset)*dt/32768*250; 
  angle_gyro += d_gyro; // 32768:max int, 250 deg/sec max rate
  
  
// complimentary filter 
  angle_com = K*(angle_com + d_gyro) + (1-K)*angle;


  Serial.print(angle);
  Serial.print(" ");
  Serial.print(angle_com);
  Serial.print("\n");

  delay(100);
}

```

起動時に実行されるsetup()ではジャイロセンサのオフセットを除去するため、
データを100回取って平均している。
このとき機体は静止していることを前提としているためなるべく動かさないようにする。
以降はこの平均をジャイロセンサの値から引いて使用している。
また、同時に加速度センサも100回の平均を取り、これを垂直の値として使用している。
これは制御の角度原点となるため、ここが垂直になっていないと倒立振子が横に動いていってしまう。


角度計算のコードのなかでジャイロセンサからの角度の値を積分するのにデータ取得間隔としてdtを掛けている。
このdtはdelay()の値やシリアル通信、そのほかの処理にかかる時間によって変化する。
そのため、処理ごとにデータ取得間隔を実測してdtの値を決定しなければいけない。

dtの値が間違っていると、ジャイロセンサからの角度の推定値が大きすぎ、または小さすぎてしまうため、機体を回転させると正しい値がでなくなる。（数秒待つと加速度センサの寄与により正しい値になっていく。）

最後に角度を0度から90度起こし、また0度に戻したときのジャイロセンサ、加速度センサ、相補フィルタ出力の3つを比較したグラフを載せる。


![angle_plot](/images/ 2019-05-19 at 20.50.07.png)
青線が加速度センサ、赤線がジャイロセンサ、緑線が相補フィルタ出力となっている。
青の加速度センサはノイズが多く、短期的にはあまり当てにならないことがわかる。
拡大すると見えるが赤のジャイロセンサは0度がずれていっている。（オフセット除去によりドリフトはそれなりに抑えられている。）
![angle_plot](/images/ 2019-05-19 at 20.56.09.png)

緑の相補フィルタは青のノイズを抑えながら赤に追従し、かつ原点のドリフトを抑えられている。



