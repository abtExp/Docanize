const entityTypes = [
    "argument",
    "author",
    "class",
    "constant",
    "constructor",
    "default",
    "event",
    "extends",
    "function",
    "method",
    "namespace",
    "param",
    "private",
    "property",
    "public",
    "requires",
    "returns",
    "static",
    "throws",
    "type",
    "typedef",
    "version"
];

const dTypes = [
    "any",
    "Array",
    "boolean",
    "char",
    "float",
    "int",
    "Number",
    "String",
    "Object"
];

class Entity {
    constructor(props) {
        this.keyword = props.entity;
        this.name = props.name;
        this.flags = props.flags;
        this.description = props.description || 'No Description';
        this.lineNumber = 0;
        this.returnVal = null;
        // array of subEntities objects
        this.paramList = [];
    }

    formComment() {
        let comment = '/**';
        comment += `\n * @${this.keyword} ${this.name}`;
        if (this.flags.CLASS_SCOPE && this.flags.EXTENDS) {
            comment += `@extends ${this.flags.EXTENDS.super}`;
        }
        if (this.description) comment += ` - ${this.description}`;
        if (this.flags.FUNCTION_SCOPE || this.flags.METHOD_SCOPE) {
            this.paramList.map(i => {
                comment += `\n * @${i.keyword} {${i.dtype.map(j=>j+'|')}} ${i.name}`;
                if (i.description) comment += ` - ${i.description}`;
            })
        }
        if (this.flags.RETURN_VAL) {
            comment += `\n * @returns ${this.returnVal}`;
        }

        comment += '\n */';
        return comment;
    }
}

class SubEntity {
    constructor(props) {
        this.keyword = props;
        this.dtype = type;
        this.name = name;
        this.description = description;
    }
}

module.exports = {
    Entity,
    SubEntity,
    dTypes,
    entityTypes
}