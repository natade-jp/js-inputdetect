# InputDetect

[![npm version](https://badge.fury.io/js/inputdetect.svg)](https://badge.fury.io/js/inputdetect)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 概要

InputDetect は、マウス・タッチ（マルチタッチ対応）など多様な入力デバイスの操作をシンプルに検知・処理できる JavaScript ライブラリです。
ドラッグ、ボタン押下、座標検知、ピンチイン・アウト（2本指操作）、ホイール操作など、Webアプリケーションでの複雑な入力処理を統一的に扱うことができます。

実際に [Github Pages](https://natade-jp.github.io/js-inputdetect/tutorial-getting-started.html) で動作を確認できます。

## 特長

- マウスとタッチ入力を、同じインターフェースで処理できる
- ドラッグ・ホイール・座標・複数ボタン同時押しなど幅広い入力に対応
- イベントリスナーを簡単に設定可能

## 使い方

~~~ js
import InputDetect from "InputDetect";
const mouse = InputDetect.create();   // タッチ&マウス両対応
mouse.setListenerOnElement(canvasElement); // イベント登録

// 定期的に状態取得
const data = mouse.pickInput();

// ボタン状態・座標取得例
console.log(data.left.switch.ispressed); // 左クリック or タッチ1本
console.log(data.position.x, data.position.y); // 座標
console.log(data.wheelrotation);         // ホイール回転量
~~~
