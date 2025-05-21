## チュートリアル

`InputDetect` を使ってGUIを作成する方法を実際に動作するデモを使用して説明します。

### 実動作

PC画面とスマホ画面の実動作を確認できます。
クリックした結果は `console.log` で出力しています。検証で表示しながら、GUIを操作してみてください。

<iframe src="./demo/" width="640" height="480" style="border: 1px solid #ccc; border-radius: 8px;"></iframe>

### 解説

1. 画面内（640x480の黒いキャンバス）でタッチやマウス操作をすると、入力の座標やボタン状態がログ出力され、押された場所に色付き円が描画されます。
2. 左クリック/タッチ1本、右クリック/タッチ2本、中央クリック/タッチ3本で色が変化します。

- `index.html`

~~~ html
<!DOCTYPE html>
<html>
	<head>
		<title>InputDetect demo</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no" />
		<script type="module" src="./main.mjs" charset="utf-8"></script>
		<link rel="stylesheet" type="text/css" href="./libs/GuiBlocks.css">
		<style type="text/css">
		#scomponent {
			display:			block;
			width:				100%;
			background-color:	#FFFFFF;
			margin:				0px;
			padding:			0em;
		}
		</style>
	</head>
	<body>
		<div id="scomponent"></div>
	</body>
</html>
~~~

- `main.mjs`

~~~ js
/**
 * InputDevice（マウスやタッチ）の利用サンプル
 * 
 * このスクリプトは、タッチやマウスのイベントを取得して、
 * その座標やボタン状態をログに表示し、押された箇所に円を描画します。
 */
const main = function() {
	
	// サンプルのタイトルをコンソールに表示
	console.log("InputDetect サンプル");
	
	// 画面の縦スクロールを禁止（スマホなどで操作しやすくする）
	InputDetect.noScroll();
	
	// GuiBlocks の Canvas コンポーネントを作成してDOMに挿入
	const scanvas = new GuiBlocks.SCanvas();
	scanvas.putMe("scomponent", GuiBlocks.PUT_TYPE.IN);
	scanvas.setUnit(GuiBlocks.UNIT_TYPE.PX);
	scanvas.setPixelSize(640, 480);
	scanvas.setSize(640, 480);
	const canvas = scanvas.getCanvas();
	
	// 背景色を黒に
	canvas.style.backgroundColor = "black";

	// 描画用の2Dコンテキスト取得
	const ctx = scanvas.getContext();
	
	// タッチ・マウス入力を取得するデバイスオブジェクト生成
	const mouse = InputDetect.create();

	// Canvasエレメントにイベントリスナーを登録（タッチ・マウス両対応）
	mouse.setListenerOnElement(scanvas.element);
	let times = 0;
	
	/**
	 * 入力情報を取得して、ログと描画を行う関数
	 * 250msごとに自動で呼び出される
	 */
	const checkMouse = function() {

		// 最新の入力情報を取得
		const data = mouse.pickInput();

		// 入力情報をログ出力（座標やボタンの状態、ドラッグ量など）
		console.log("time[" + (times++) + "]");
		console.log("position      "		+ data.position.x + "," + data.position.y);
		console.log("wheelrotation "		+ data.wheelrotation);
		console.log("draggedL       "	+ data.left.dragged.x	+ "," + data.left.dragged.y);
		console.log("draggedR       "	+ data.right.dragged.x	+ "," + data.right.dragged.y);
		console.log("ispressed  "		+ data.left.switch.ispressed	+ "," + data.right.switch.ispressed		+ "," + data.center.switch.ispressed);
		console.log("isreleased "		+ data.left.switch.isreleased	+ "," + data.right.switch.isreleased	+ "," + data.center.switch.isreleased);
		console.log("istyped    "		+ data.left.switch.istyped		+ "," + data.right.switch.istyped		+ "," + data.center.switch.istyped);
		
		// 円の色は押されたボタンによって変化
		let color;
		const ispressed = data.left.switch.ispressed || data.right.switch.ispressed || data.center.switch.ispressed;
		if(data.left.switch.ispressed) {
			// 左クリック／タッチ1本
			color = NTColor.newColorNormalizedHSV(times * 0.1, 1.0, 1.0, 0.8);
		}
		else if(data.right.switch.ispressed) {
			// 右クリック／タッチ2本
			color = NTColor.newColorNormalizedHSV(times * 0.1, 0.1, 1.0, 0.8);
		}
		else if(data.center.switch.ispressed) {
			// 中央クリック／タッチ3本
			color = NTColor.newColorNormalizedHSV(times * 0.1, 1.0, 0.1, 0.8);
		}

		if(ispressed) {
			// 押されている場所に50pxの円を描画
			ctx.beginPath();
			ctx.fillStyle = color.toCSS255();
			ctx.arc( data.position.x, data.position.y, 50, 0, 2 * Math.PI, true);
			ctx.fill();
		}
	};
	
	// 250msごとに入力チェック（実質リアルタイム）
	setInterval(checkMouse, 250);
	
};

// メイン関数を実行
main();
~~~
