'use strict';

/**
 * IDSwitch.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

/**
 * スイッチ（ボタン）の押下状態を管理するクラスです。
 * ボタンの押下・離す・押し続け・押した瞬間・離した瞬間など、さまざまなスイッチの状態を判定できます。
 */
class IDSwitch {
	/**
	 * 押す、離すが可能なボタンスイッチの状態管理クラス
	 * @constructor
	 */
	constructor() {
		this._initIDSwitch();
	}

	/**
	 * スイッチの状態を初期化します。
	 * @private
	 */
	_initIDSwitch() {
		/**
		 * 押した瞬間にtrueになります（1フレームのみ）
		 * @type {boolean}
		 */
		this.istyped = false;

		/**
		 * 押している間trueになります（押しっぱなし判定）
		 * @type {boolean}
		 */
		this.ispressed = false;

		/**
		 * 離した瞬間にtrueになります（1フレームのみ）
		 * @type {boolean}
		 */
		this.isreleased = false;

		/**
		 * 押している時間（フレーム数）
		 * @type {number}
		 */
		this.pressed_time = 0;
	}

	/**
	 * このスイッチの状態をコピーした新しいインスタンスを返します。
	 * @returns {IDSwitch} 複製したIDSwitchインスタンス
	 */
	clone() {
		const ret = new IDSwitch();
		ret.istyped = this.istyped;
		ret.ispressed = this.ispressed;
		ret.isreleased = this.isreleased;
		ret.pressed_time = this.pressed_time;
		return ret;
	}

	/**
	 * ボタンが押されたことを記録します。
	 * 1フレーム目はistyped、以降はispressedがtrueになります。
	 */
	keyPressed() {
		if (!this.ispressed) {
			this.istyped = true;
		}
		this.ispressed = true;
		this.pressed_time++;
	}

	/**
	 * ボタンが離されたことを記録します。
	 * isreleasedがtrueになり、ispressedがfalseになります。
	 */
	keyReleased() {
		this.ispressed = false;
		this.isreleased = true;
		this.pressed_time = 0;
	}

	/**
	 * フォーカスが外れた場合に状態をリセットします。
	 */
	focusLost() {
		this.keyReleased();
	}

	/**
	 * 他のIDSwitchインスタンスへ現在のスイッチ状態を渡します。
	 * 1フレームごとに必要な値だけを転送し、istyped/isreleasedはfalse化されます。
	 * @param {IDSwitch} c - 情報を受け取るIDSwitchインスタンス
	 * @throws {string} - cがIDSwitchのインスタンスでない場合
	 */
	pickInput(c) {
		if (!(c instanceof IDSwitch)) {
			throw "IllegalArgumentException";
		}
		c.ispressed = this.ispressed;
		c.istyped = this.istyped;
		c.isreleased = this.isreleased;
		c.pressed_time = this.pressed_time;
		this.isreleased = false;
		this.istyped = false;
	}
}

/**
 * IDPosition.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

/**
 * 位置情報を管理するクラスです。
 * x, y座標の操作や、座標同士の加算・減算、クローン生成などの機能を持ちます。
 */
class IDPosition {
	/**
	 * x座標
	 * @type {number}
	 */
	x = 0;

	/**
	 * y座標
	 * @type {number}
	 */
	y = 0;

	/**
	 * 位置情報を表すクラス
	 * @param {Number|IDPosition} [x] - x座標 または IDPositionインスタンス
	 * @param {Number} [y] - y座標
	 * @constructor
	 */
	constructor(x, y) {
		this._initIDPosition(x, y);
	}

	/**
	 * 内部的に位置情報を初期化します。
	 * @param {Number|IDPosition} [x] - x座標 または IDPositionインスタンス
	 * @param {Number} [y] - y座標
	 */
	_initIDPosition(x, y) {
		if (x instanceof IDPosition) {
			const position = x;
			this.set(position);
		} else if (x === undefined) {
			this.x = 0;
			this.y = 0;
		} else if (arguments.length === 2) {
			this.set(x, y);
		} else {
			this.x = 0;
			this.y = 0;
		}
	}

	/**
	 * このインスタンスのコピーを生成します。
	 * @returns {IDPosition} 複製したIDPosition
	 */
	clone() {
		const ret = new IDPosition(this);
		return ret;
	}

	/**
	 * 座標値を設定します。
	 * @param {Number|IDPosition} x - x座標 または IDPositionインスタンス
	 * @param {Number} [y] - y座標
	 */
	set(x, y) {
		if (x instanceof IDPosition) {
			const position = x;
			this.x = position.x;
			this.y = position.y;
		} else {
			this.x = x;
			this.y = y;
		}
	}

	/**
	 * 座標値を加算します。
	 * @param {Number|IDPosition} x - 加算するx座標 または IDPositionインスタンス
	 * @param {Number} [y] - 加算するy座標
	 */
	add(x, y) {
		if (x instanceof IDPosition) {
			const position = x;
			this.x += position.x;
			this.y += position.y;
		} else {
			this.x += x;
			this.y += y;
		}
	}

	/**
	 * 座標値を減算します。
	 * @param {Number|IDPosition} x - 減算するx座標 または IDPositionインスタンス
	 * @param {Number} [y] - 減算するy座標
	 */
	sub(x, y) {
		if (x instanceof IDPosition) {
			const position = x;
			this.x -= position.x;
			this.y -= position.y;
		} else {
			this.x -= x;
			this.y -= y;
		}
	}

	/**
	 * 2点間の距離（ノルム）を計算します。
	 * @param {IDPosition} p1 - 1点目の座標
	 * @param {IDPosition} p2 - 2点目の座標
	 * @returns {Number} 2点間のユークリッド距離
	 */
	static norm(p1, p2) {
		const x = p1.x - p2.x;
		const y = p1.y - p2.y;
		return Math.sqrt(x * x + y * y);
	}
}

/**
 * IDDraggableSwitch.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */


/**
 * ドラッグ可能なスイッチ（ボタン）の状態を管理するクラスです。
 * クリックやドラッグ操作の開始・終了・移動を追跡し、イベントごとに内部状態を更新できます。
 */
class IDDraggableSwitch {
	/**
	 * ドラッグ操作可能なスイッチの状態を管理するクラス
	 * @param {number} mask - 対象となるボタン（0:左, 1:中央, 2:右）
	 * @constructor
	 */
	constructor(mask) {
		this._initIDDraggableSwitch(mask);
	}

	/**
	 * 各プロパティを初期化します。
	 * @param {number} mask - 対象ボタン番号
	 * @private
	 */
	_initIDDraggableSwitch(mask) {
		/**
		 * このインスタンスが監視するボタン種別（0:左, 1:中央, 2:右）
		 * @type {number}
		 */
		this.mask = mask;

		/**
		 * ボタンの押下状態を管理するIDSwitchインスタンス
		 * @type {IDSwitch}
		 */
		this.switch = new IDSwitch();

		/**
		 * 現在の位置（client座標系）
		 * @type {IDPosition}
		 */
		this.client = new IDPosition();

		/**
		 * ドラッグ開始位置
		 * @type {IDPosition}
		 */
		this.deltaBase = new IDPosition();

		/**
		 * ドラッグ量（始点からの移動量）
		 * @type {IDPosition}
		 */
		this.dragged = new IDPosition();
	}

	/**
	 * このインスタンスの複製を作成します。
	 * @returns {IDDraggableSwitch} 複製したIDDraggableSwitchインスタンス
	 */
	clone() {
		const ret = new IDDraggableSwitch(this.mask);
		ret.switch = this.switch.clone();
		ret.client = this.client.clone();
		ret.deltaBase = this.deltaBase.clone();
		ret.dragged = this.dragged.clone();
		return ret;
	}

	/**
	 * DOMイベントの位置情報から、ノードサイズに応じた正規化座標を計算します。
	 * 画像やcanvasのスケーリングに対応した正しい座標を返します。
	 * @param {MouseEvent|TouchEvent} event - イベントオブジェクト
	 * @returns {IDPosition} 計算済みの位置情報
	 */
	correctionForDOM(event) {
		// イベントが発生したノードの取得
		let node = event.target;
		if (!node) {
			// IE?
			node = event.currentTarget;
		}
		let clientX = 0;
		let clientY = 0;
		if ("clientX" in event && "clientY" in event) {
			clientX = event.clientX;
			clientY = event.clientY;
		} else if ("touches" in event && event.touches.length > 0) {
			clientX = event.touches[0].clientX;
			clientY = event.touches[0].clientY;
		}
		if (node === undefined) {
			return new IDPosition(clientX, clientY);
		} else {
			// ノードのサイズが変更されていることを考慮する
			// width / height が内部のサイズ
			// clientWidth / clientHeight が表示上のサイズ
			const element = /** @type {HTMLElement} */ (node);
			// Try to cast node to HTMLImageElement or HTMLCanvasElement to access width/height
			let width = element.clientWidth;
			let height = element.clientHeight;
			if ("width" in node && typeof node.width === "number") {
				width = node.width;
			}
			if ("height" in node && typeof node.height === "number") {
				height = node.height;
			}
			return new IDPosition((clientX / element.clientWidth) * width, (clientY / element.clientHeight) * height);
		}
	}

	/**
	 * 指定イベントの座標位置で、全ての位置情報を強制的にセットします。
	 * @param {MouseEvent|TouchEvent} event - イベントオブジェクト
	 */
	setPosition(event) {
		const position = this.correctionForDOM(event);
		this.client.set(position);
		this.deltaBase.set(position);
		this.dragged._initIDPosition();
	}

	/**
	 * マウスボタンが押された時の処理。
	 * 指定ボタン（mask）が押された時のみ内部状態を更新します。
	 * @param {MouseEvent} event - マウスイベント
	 */
	mousePressed(event) {
		const position = this.correctionForDOM(event);
		const state = event.button;
		if (state === this.mask) {
			if (!this.switch.ispressed) {
				this.dragged._initIDPosition();
			}
			this.switch.keyPressed();
			this.client.set(position);
			this.deltaBase.set(position);
		}
	}

	/**
	 * マウスボタンが離された時の処理。
	 * @param {MouseEvent} event - マウスイベント
	 */
	mouseReleased(event) {
		const state = event.button;
		if (state === this.mask) {
			if (this.switch.ispressed) {
				this.switch.keyReleased();
			}
		}
	}

	/**
	 * マウス移動時の処理。
	 * ドラッグ中なら移動量（dragged）を加算していきます。
	 * @param {MouseEvent} event - マウスイベント
	 */
	mouseMoved(event) {
		const position = this.correctionForDOM(event);
		if (this.switch.ispressed) {
			const delta = new IDPosition(position);
			delta.sub(this.deltaBase);
			this.dragged.add(delta);
		}
		this.client.set(position.x, position.y);
		this.deltaBase.set(position.x, position.y);
	}

	/**
	 * フォーカスが外れた場合の状態リセット処理。
	 */
	focusLost() {
		this.switch.focusLost();
	}

	/**
	 * 他のIDDraggableSwitchインスタンスに現在の入力情報をコピーします。
	 * ドラッグ量はリセットされます。
	 * @param {IDDraggableSwitch} c - 情報を受け取るインスタンス
	 * @throws {string} cがIDDraggableSwitchでない場合
	 */
	pickInput(c) {
		if (!(c instanceof IDDraggableSwitch)) {
			throw "IllegalArgumentException";
		}
		this.switch.pickInput(c.switch);
		c.client.set(this.client);
		c.dragged.set(this.dragged);
		this.dragged._initIDPosition();
	}
}

/**
 * IDMouse.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */


/**
 * マウス入力を管理するクラスです。
 * 左・中央・右クリックの状態やドラッグ・ホイール回転・マウス座標の追跡を行い、複数ボタンの同時押しにも対応しています。
 */
class IDMouse {
	/**
	 * マウスの入力情報を管理するクラス
	 * 左・中央・右ボタン、位置、ホイールなどをまとめて扱えます。
	 * @constructor
	 */
	constructor() {
		this._initIDMouse();
	}

	/**
	 * 各プロパティを初期化します。
	 * @private
	 */
	_initIDMouse() {
		/**
		 * 左ボタンの状態を管理するオブジェクト
		 * @type {IDDraggableSwitch}
		 */
		this.left = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON1_MASK);

		/**
		 * 中央ボタンの状態を管理するオブジェクト
		 * @type {IDDraggableSwitch}
		 */
		this.center = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON2_MASK);

		/**
		 * 右ボタンの状態を管理するオブジェクト
		 * @type {IDDraggableSwitch}
		 */
		this.right = new IDDraggableSwitch(IDMouse.MOUSE_EVENTS.BUTTON3_MASK);

		/**
		 * 現在のマウス座標
		 * @type {IDPosition}
		 */
		this.position = new IDPosition();

		/**
		 * ホイールの回転量
		 * @type {number}
		 */
		this.wheelrotation = 0;
	}

	/**
	 * このインスタンスの複製を作成します。
	 * @returns {IDMouse} 複製したIDMouseインスタンス
	 */
	clone() {
		const ret = new IDMouse();
		ret.left = this.left.clone();
		ret.center = this.center.clone();
		ret.right = this.right.clone();
		ret.position = this.position.clone();
		ret.wheelrotation = this.wheelrotation;
		return ret;
	}

	/**
	 * マウスボタンが押された時の処理を行います。
	 * それぞれのボタンごとに対応する状態を更新します。
	 * @param {MouseEvent} mouseevent - マウスイベントまたは同等のオブジェクト
	 */
	mousePressed(mouseevent) {
		this.left.mousePressed(mouseevent);
		this.center.mousePressed(mouseevent);
		this.right.mousePressed(mouseevent);
	}

	/**
	 * マウスボタンが離された時の処理を行います。
	 * @param {MouseEvent} mouseevent - マウスイベントまたは同等のオブジェクト
	 */
	mouseReleased(mouseevent) {
		this.left.mouseReleased(mouseevent);
		this.center.mouseReleased(mouseevent);
		this.right.mouseReleased(mouseevent);
	}

	/**
	 * マウス移動時の処理を行います。
	 * それぞれのボタンのドラッグ状態や現在位置を更新します。
	 * @param {MouseEvent} mouseevent - マウスイベントまたは同等のオブジェクト
	 */
	mouseMoved(mouseevent) {
		this.left.mouseMoved(mouseevent);
		this.center.mouseMoved(mouseevent);
		this.right.mouseMoved(mouseevent);
		this.position.x = this.left.client.x;
		this.position.y = this.left.client.y;
	}

	/**
	 * ホイール回転イベントの処理を行います。
	 * @param {WheelEvent} event - ホイールイベントまたは同等のオブジェクト
	 */
	mouseWheelMoved(event) {
		if (event.deltaY !== 0) {
			this.wheelrotation += event.deltaY > 0 ? -1 : 1;
		}
	}

	/**
	 * マウスカーソルが要素外に出た場合の処理（状態リセット等）を行います。
	 */
	focusLost() {
		this.left.focusLost();
		this.center.focusLost();
		this.right.focusLost();
	}

	/**
	 * 他のIDMouseインスタンスへ現在の入力情報をコピーします。
	 * 各ボタンや位置、ホイール回転量が渡され、渡した後はホイール量がリセットされます。
	 * @param {IDMouse} c - 情報を受け取るIDMouseインスタンス
	 * @throws {string} cがIDMouseでない場合
	 */
	pickInput(c) {
		if (!(c instanceof IDMouse)) {
			throw "IllegalArgumentException";
		}
		this.left.pickInput(c.left);
		this.center.pickInput(c.center);
		this.right.pickInput(c.right);
		c.position.set(this.position);
		c.wheelrotation = this.wheelrotation;
		this.wheelrotation = 0;
	}

	/**
	 * 指定した要素にマウス入力イベントリスナーを登録します。
	 * これにより、押下・移動・ホイール回転・フォーカスロスト等のイベントをこのクラスで検知できます。
	 * @param {HTMLElement} element - イベントリスナーを設定するDOM要素
	 */
	setListenerOnElement(element) {
		const that = this;
		/**
		 * @param {MouseEvent} e
		 */
		const mousePressed = function (e) {
			that.mousePressed(e);
		};

		/**
		 * @param {MouseEvent} e
		 */
		const mouseReleased = function (e) {
			that.mouseReleased(e);
		};

		/**
		 * @param {MouseEvent} e
		 */
		const mouseMoved = function (e) {
			that.mouseMoved(e);
		};

		const focusLost = function () {
			that.focusLost();
		};

		/**
		 * @param {WheelEvent} e
		 */
		const mouseWheelMoved = function (e) {
			that.mouseWheelMoved(e);
			e.preventDefault();
		};

		/**
		 * @param {Event} e
		 */
		const contextMenu = function (e) {
			e.preventDefault();
		};
		element.style.cursor = "crosshair";
		// 非選択化
		element.style.userSelect = "none";
		element.style.setProperty("-moz-user-select", "none");
		element.style.setProperty("-webkit-user-select", "none");
		element.style.setProperty("-ms-user-select", "none");
		// メニュー非表示化
		element.style.setProperty("-webkit-touch-callout", "none");
		// タップのハイライトカラーを消す
		element.style.setProperty("-webkit-tap-highlight-color", "rgba(0,0,0,0)");

		element.addEventListener("mousedown", mousePressed, false);
		element.addEventListener("mouseup", mouseReleased, false);
		element.addEventListener("mousemove", mouseMoved, false);
		element.addEventListener("mouseout", focusLost, false);
		element.addEventListener("wheel", mouseWheelMoved, false);
		element.addEventListener("contextmenu", contextMenu, false);
	}
}

/**
 * マウスボタン番号の定数
 * BUTTON1_MASK: 左ボタン, BUTTON2_MASK: 中央ボタン, BUTTON3_MASK: 右ボタン
 * @enum {number}
 */
IDMouse.MOUSE_EVENTS = {
	/**
	 * 左ボタン
	 * @type {number}
	 */
	BUTTON1_MASK: 0,
	/**
	 * 中央ボタン
	 * @type {number}
	 */
	BUTTON2_MASK: 1,
	/**
	 * 右ボタン
	 * @type {number}
	 */
	BUTTON3_MASK: 2
};

/**
 * IDTouch.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */


/**
 * タッチデバイス入力を管理するクラスです。
 * 最大3本指のマルチタッチ操作を検出し、それぞれをマウスの左・右・中央クリックに割り当てて管理できます。
 * タッチイベントをPCのマウスイベントとして扱う変換処理も含まれています。
 */
class IDTouch extends IDMouse {
	/**
	 * 指3本までのタッチ操作に対応した入力管理クラス
	 * 1本目は左クリック、2本目は右クリック、3本目は中央クリックとして扱います。
	 * @constructor
	 */
	constructor() {
		super();
		this._initIDTouch();
	}

	/**
	 * 内部の初期化処理を行います。
	 * @private
	 */
	_initIDTouch() {
		/**
		 * タッチ数とマウスボタン番号のマッピング
		 * @type {Object<number, number>}
		 */
		this.touchcount_to_mask = {
			1: IDMouse.MOUSE_EVENTS.BUTTON1_MASK,
			2: IDMouse.MOUSE_EVENTS.BUTTON3_MASK,
			3: IDMouse.MOUSE_EVENTS.BUTTON2_MASK
		};
		const that = this;
		/**
		 * @param {MouseEvent} e
		 */
		this._mousePressed = function (e) {
			that.mousePressed(e);
		};
		/**
		 * @param {MouseEvent} e
		 */
		this._mouseReleased = function (e) {
			that.mouseReleased(e);
		};
		/**
		 * @param {MouseEvent} e
		 */
		this._mouseMoved = function (e) {
			that.mouseMoved(e);
		};
		/**
		 * 2本指の操作中かどうか
		 * @type {boolean}
		 */
		this.isdoubletouch = false;

		/**
		 * @type {IDPosition}
		 * @private
		 */
		this._doubleposition_p1 = null;

		/**
		 * @type {IDPosition}
		 * @private
		 */
		this._doubleposition_p2 = null;
	}

	/**
	 * タッチ開始時、すべての座標情報を初期化します。
	 * @param {MouseEvent|TouchEvent} mouseevent - マウスイベント相当のオブジェクト
	 * @private
	 */
	_initPosition(mouseevent) {
		this.left.setPosition(mouseevent);
		this.right.setPosition(mouseevent);
		this.center.setPosition(mouseevent);
	}

	/**
	 * マウスイベントのプロパティを仮想的なマウスイベント
	 * @typedef {Object} VirtualMouseEvent
	 * @property {number} clientX マウスのX座標
	 * @property {number} clientY マウスのY座標
	 * @property {number} button マウスボタンの種類
	 * @property {EventTarget} target イベントのターゲット
	 * @property {number} touchcount タッチ数
	 */

	/**
	 * タッチイベントを仮想的なマウスイベントへ変換します。
	 * 指の平均座標を計算し、タッチ数から対応するボタンを設定します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @returns {MouseEvent} 仮想マウスイベントオブジェクト
	 * @private
	 */
	_MultiTouchToMouse(touchevent) {
		let x = 0,
			y = 0;
		// 座標はすべて平均値の位置とします。
		// identifier を使用すれば、1本目、2本目と管理できますが、実装は未対応となっています。
		for (let i = 0; i < touchevent.touches.length; i++) {
			x += touchevent.touches[i].clientX;
			y += touchevent.touches[i].clientY;
		}
		/**
		 * @type {VirtualMouseEvent}
		 */
		const event = {};
		if (touchevent.touches.length > 0) {
			event.clientX = x / touchevent.touches.length;
			event.clientY = y / touchevent.touches.length;
			event.button = this.touchcount_to_mask[touchevent.touches.length];
			const touch = touchevent.touches[0];
			event.target = touch.target ? touch.target : touchevent.currentTarget;
		} else {
			event.clientX = 0;
			event.clientY = 0;
			event.button = 0;
		}
		event.touchcount = touchevent.touches.length;
		// @ts-ignore
		return /** @type {MouseEvent} */ event;
	}

	/**
	 * 2本指タッチによるピンチ操作を検出し、ホイール回転に変換します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 * @private
	 */
	_MoveMultiTouch(touchevent) {
		if (touchevent.touches.length === 2) {
			const p1 = touchevent.touches[0];
			const p2 = touchevent.touches[1];
			if (this.isdoubletouch === false) {
				this.isdoubletouch = true;
				this._doubleposition_p1 = new IDPosition(p1.clientX, p1.clientY);
				this._doubleposition_p2 = new IDPosition(p2.clientX, p2.clientY);
			} else {
				// 前回との2点間の距離の増加幅を調べる
				// これによりピンチイン／ピンチアウト操作がわかる。
				const newp1 = new IDPosition(p1.clientX, p1.clientY);
				const newp2 = new IDPosition(p2.clientX, p2.clientY);
				const x =
					IDPosition.norm(this._doubleposition_p1, this._doubleposition_p2) - IDPosition.norm(newp1, newp2);
				this._doubleposition_p1 = newp1;
				this._doubleposition_p2 = newp2;
				// そんなにずれていなかったら無視する
				const r = Math.abs(x) < 10 ? Math.abs(x) * 0.01 : 0.5;
				this.wheelrotation += (x > 0 ? -1 : 1) * r;
			}
		} else {
			this.isdoubletouch === false;
		}
	}

	/**
	 * 指定されたボタンに応じて関数を呼び分けます。
	 * @param {MouseEvent} mouseevent - 仮想マウスイベント
	 * @param {Function} funcOn - 対象ボタンで呼ぶ関数
	 * @param {Function} funcOff - それ以外のボタンで呼ぶ関数
	 * @param {number} target - 対象となるボタン番号
	 * @private
	 */
	_actFuncMask(mouseevent, funcOn, funcOff, target) {
		const events = /** @type {VirtualMouseEvent} */ mouseevent;
		for (const key in IDMouse.MOUSE_EVENTS) {
			// @ts-ignore
			events.button = IDMouse.MOUSE_EVENTS[key];
			// @ts-ignore
			if (IDMouse.MOUSE_EVENTS[key] === target) {
				funcOn(events);
			} else {
				funcOff(events);
			}
		}
	}

	/**
	 * タッチ開始イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 */
	touchStart(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		// タッチした時点ですべての座標を初期化する
		this._initPosition(mouseevent);
		this._actFuncMask(mouseevent, this._mousePressed, this._mouseReleased, mouseevent.button);
	}

	/**
	 * タッチ終了イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 */
	touchEnd(touchevent) {
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(mouseevent, this._mouseReleased, this._mouseReleased, mouseevent.button);
	}

	/**
	 * タッチ移動イベントを処理します。
	 * @param {TouchEvent} touchevent - タッチイベント
	 */
	touchMove(touchevent) {
		this._MoveMultiTouch(touchevent);
		const mouseevent = this._MultiTouchToMouse(touchevent);
		this._actFuncMask(mouseevent, this._mouseMoved, this._mouseMoved, mouseevent.button);
	}

	/**
	 * 対象要素にタッチイベントリスナーを設定します。
	 * @param {HTMLElement} element - イベントを監視するDOM要素
	 */
	setListenerOnElement(element) {
		super.setListenerOnElement(element);

		const that = this;

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchStart = function (touchevent) {
			that.touchStart(touchevent);
		};

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchEnd = function (touchevent) {
			that.touchEnd(touchevent);
		};

		/**
		 * @param {TouchEvent} touchevent
		 */
		const touchMove = function (touchevent) {
			that.touchMove(touchevent);
			// スクロール禁止
			touchevent.preventDefault();
		};

		element.addEventListener("touchstart", touchStart, false);
		element.addEventListener("touchend", touchEnd, false);
		element.addEventListener("touchmove", touchMove, false);
		element.addEventListener("touchcancel", touchEnd, false);
	}
}

/**
 * IDTools.js
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

/**
 * デバイス系ツールユーティリティのオブジェクトです。
 * 主に画面スクロールの制御など、補助的な機能を提供します。
 */
const IDTools = {
	/**
	 * ページの縦スクロールバーを非表示にします。
	 * HTMLのbodyとhtml要素のスタイルを変更し、ページ全体でスクロールを禁止します。
	 *
	 * @function
	 * @returns {void}
	 *
	 * @example
	 * // ページの縦スクロールを禁止したいときに実行
	 * IDTools.noScroll();
	 */
	noScroll: function () {
		// 縦のスクロールバーを削除
		const main = function () {
			// body
			document.body.style.height = "100%";
			document.body.style.overflow = "hidden";
			// html
			document.documentElement.style.height = "100%";
			document.documentElement.style.overflow = "hidden";
		};
		window.addEventListener("load", main, false);
	}
};

/**
 * InputDetect
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */


/**
 * デバイス操作APIのエントリーポイント
 * @namespace Device
 * @property {typeof IDDraggableSwitch} IDDraggableSwitch - ドラッグ可能なスイッチ操作クラス
 * @property {typeof IDMouse} IDMouse - マウス操作クラス
 * @property {typeof IDPosition} IDPosition - 座標管理クラス
 * @property {typeof IDSwitch} IDSwitch - スイッチ（ボタン）状態管理クラス
 * @property {typeof IDTouch} IDTouch - タッチ操作クラス
 * @property {typeof IDTools} IDTools - デバイス操作ユーティリティ
 */
const InputDetect = {
	IDDraggableSwitch: IDDraggableSwitch,
	IDMouse: IDMouse,
	IDPosition: IDPosition,
	IDSwitch: IDSwitch,
	IDTouch: IDTouch,
	IDTools: IDTools
};

module.exports = InputDetect;
