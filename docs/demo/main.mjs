import InputDetect from "./libs/InputDetect.min.js";
import NTColor from "./libs/NTColor.min.js";
import GuiBlocks from "./libs/GuiBlocks.min.js";

const Device = InputDetect;

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
	Device.IDTools.noScroll();
	
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
	const mouse = new Device.IDTouch();

	// Canvasエレメントにイベントリスナーを登録（タッチ・マウス両対応）
	mouse.setListenerOnElement(scanvas.element);
	let times = 0;
	
	/**
	 * 入力情報を取得して、ログと描画を行う関数
	 * 250msごとに自動で呼び出される
	 */
	const checkMouse = function() {

		// 最新の入力情報を取得
		const data = new Device.IDTouch();
		mouse.pickInput(data);

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
