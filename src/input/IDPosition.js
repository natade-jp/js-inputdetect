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
export default class IDPosition {
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
