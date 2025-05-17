/**
 * InputDetect
 *
 * @module InputDetect
 * @author natade (https://github.com/natade-jp)
 * @license MIT
 */

import IDDraggableSwitch from "./input/IDDraggableSwitch.js";
import IDMouse from "./input/IDMouse.js";
import IDPosition from "./input/IDPosition.js";
import IDSwitch from "./input/IDSwitch.js";
import IDTouch from "./input/IDTouch.js";
import IDTools from "./input/IDTools.js";

/**
 * デバイス操作APIのエントリーポイント
 * @namespace InputDetect
 * @property {IDDraggableSwitch} IDDraggableSwitch - ドラッグ可能なスイッチ操作クラス
 * @property {IDMouse} IDMouse - マウス操作クラス
 * @property {IDPosition} IDPosition - 座標管理クラス
 * @property {IDSwitch} IDSwitch - スイッチ（ボタン）状態管理クラス
 * @property {IDTouch} IDTouch - タッチ操作クラス
 * @property {IDTools} IDTools - デバイス操作ユーティリティ
 */
const InputDetect = {
	IDDraggableSwitch: IDDraggableSwitch,
	IDMouse: IDMouse,
	IDPosition: IDPosition,
	IDSwitch: IDSwitch,
	IDTouch: IDTouch,
	IDTools: IDTools
};

export default InputDetect;
