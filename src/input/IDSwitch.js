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
export default class IDSwitch {
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
