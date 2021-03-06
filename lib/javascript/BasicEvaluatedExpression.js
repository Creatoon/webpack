/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

"use strict";

const TypeUnknown = 0;
const TypeUndefined = 1;
const TypeNull = 2;
const TypeString = 3;
const TypeNumber = 4;
const TypeBoolean = 5;
const TypeRegExp = 6;
const TypeConditional = 7;
const TypeArray = 8;
const TypeConstArray = 9;
const TypeIdentifier = 10;
const TypeWrapped = 11;
const TypeTemplateString = 12;
const TypeBigInt = 13;

class BasicEvaluatedExpression {
	constructor() {
		this.type = TypeUnknown;
		this.range = undefined;
		this.falsy = false;
		this.truthy = false;
		this.bool = undefined;
		this.number = undefined;
		this.bigint = undefined;
		this.regExp = undefined;
		this.string = undefined;
		this.quasis = undefined;
		this.parts = undefined;
		this.array = undefined;
		this.items = undefined;
		this.options = undefined;
		this.prefix = undefined;
		this.postfix = undefined;
		this.wrappedInnerExpressions = undefined;
		this.identifier = undefined;
		this.rootInfo = undefined;
		this.getMembers = undefined;
		this.expression = undefined;
	}

	isNull() {
		return this.type === TypeNull;
	}

	isUndefined() {
		return this.type === TypeUndefined;
	}

	isString() {
		return this.type === TypeString;
	}

	isNumber() {
		return this.type === TypeNumber;
	}

	isBigInt() {
		return this.type === TypeBigInt;
	}

	isBoolean() {
		return this.type === TypeBoolean;
	}

	isRegExp() {
		return this.type === TypeRegExp;
	}

	isConditional() {
		return this.type === TypeConditional;
	}

	isArray() {
		return this.type === TypeArray;
	}

	isConstArray() {
		return this.type === TypeConstArray;
	}

	isIdentifier() {
		return this.type === TypeIdentifier;
	}

	isWrapped() {
		return this.type === TypeWrapped;
	}

	isTemplateString() {
		return this.type === TypeTemplateString;
	}

	isTruthy() {
		return this.truthy;
	}

	isFalsy() {
		return this.falsy;
	}

	asBool() {
		if (this.truthy) return true;
		if (this.falsy) return false;
		if (this.isBoolean()) return this.bool;
		if (this.isNull()) return false;
		if (this.isUndefined()) return false;
		if (this.isString()) return this.string !== "";
		if (this.isNumber()) return this.number !== 0;
		if (this.isBigInt()) return this.bigint !== BigInt(0);
		if (this.isRegExp()) return true;
		if (this.isArray()) return true;
		if (this.isConstArray()) return true;
		if (this.isWrapped()) {
			return (this.prefix && this.prefix.asBool()) ||
				(this.postfix && this.postfix.asBool())
				? true
				: undefined;
		}
		if (this.isTemplateString()) {
			const str = this.asString();
			if (typeof str === "string") return str !== "";
		}
		return undefined;
	}

	asString() {
		if (this.isBoolean()) return `${this.bool}`;
		if (this.isNull()) return "null";
		if (this.isUndefined()) return "undefined";
		if (this.isString()) return this.string;
		if (this.isNumber()) return `${this.number}`;
		if (this.isBigInt()) return `${this.bigint}`;
		if (this.isRegExp()) return `${this.regExp}`;
		if (this.isArray()) {
			let array = [];
			for (const item of this.items) {
				const itemStr = item.asString();
				if (itemStr === undefined) return undefined;
				array.push(itemStr);
			}
			return `${array}`;
		}
		if (this.isConstArray()) return `${this.array}`;
		if (this.isTemplateString()) {
			let str = "";
			for (const part of this.parts) {
				const partStr = part.asString();
				if (partStr === undefined) return undefined;
				str += partStr;
			}
			return str;
		}
		return undefined;
	}

	setString(string) {
		this.type = TypeString;
		this.string = string;
		return this;
	}

	setUndefined() {
		this.type = TypeUndefined;
		return this;
	}

	setNull() {
		this.type = TypeNull;
		return this;
	}

	setNumber(number) {
		this.type = TypeNumber;
		this.number = number;
		return this;
	}

	setBigInt(bigint) {
		this.type = TypeBigInt;
		this.bigint = bigint;
		return this;
	}

	setBoolean(bool) {
		this.type = TypeBoolean;
		this.bool = bool;
		return this;
	}

	setRegExp(regExp) {
		this.type = TypeRegExp;
		this.regExp = regExp;
		return this;
	}

	setIdentifier(identifier, rootInfo, getMembers) {
		this.type = TypeIdentifier;
		this.identifier = identifier;
		this.rootInfo = rootInfo;
		this.getMembers = getMembers;
		return this;
	}

	setWrapped(prefix, postfix, innerExpressions) {
		this.type = TypeWrapped;
		this.prefix = prefix;
		this.postfix = postfix;
		this.wrappedInnerExpressions = innerExpressions;
		return this;
	}

	setOptions(options) {
		this.type = TypeConditional;
		this.options = options;
		return this;
	}

	addOptions(options) {
		if (!this.options) {
			this.type = TypeConditional;
			this.options = [];
		}
		for (const item of options) {
			this.options.push(item);
		}
		return this;
	}

	setItems(items) {
		this.type = TypeArray;
		this.items = items;
		return this;
	}

	setArray(array) {
		this.type = TypeConstArray;
		this.array = array;
		return this;
	}

	setTemplateString(quasis, parts, kind) {
		this.type = TypeTemplateString;
		this.quasis = quasis;
		this.parts = parts;
		this.templateStringKind = kind;
		return this;
	}

	setTruthy() {
		this.falsy = false;
		this.truthy = true;
		return this;
	}

	setFalsy() {
		this.falsy = true;
		this.truthy = false;
		return this;
	}

	setRange(range) {
		this.range = range;
		return this;
	}

	setExpression(expression) {
		this.expression = expression;
		return this;
	}
}

module.exports = BasicEvaluatedExpression;
