// const entityTypes = [
//     "argument",
//     "author",
//     "class",
//     "constant",
//     "constructor",
//     "default",
//     "event",
//     "extends",
//     "function",
//     "method",
//     "namespace",
//     "param",
//     "private",
//     "property",
//     "public",
//     "requires",
//     "returns",
//     "static",
//     "throws",
//     "type",
//     "typedef",
//     "version"
// ];

// const dTypes = [
//     "any",
//     "Array",
//     "boolean",
//     "char",
//     "float",
//     "int",
//     "Number",
//     "String",
//     "Object"
// ];

class Entity {
    constructor(props = {}) {
        this.keyword = props.keyword;
        this.name = props.name;
        this.flags = props.flags;
        this.description = props.description;
        this.lineNumber = props.lineNumber;
        this.returnVal = props.returnVal;
        this.specifiers = props.specifiers;
        // array of subEntities objects
        this.paramList = props.subEntities || [];
    }

    formComment() {
        let comment = '/**';
        comment += `\n * @${this.keyword}`;
        comment += ` ${this.specifiers ? this.specifiers.map(i=>`@${i}`) : ''} `;
        comment += `${this.name ? this.name : ''}`;
        if (this.flags.CLASS_SCOPE && this.flags.EXTENDS.super) {
            comment += ` @extends ${this.flags.EXTENDS.super}`;
        }
        if (this.flags.GIVEN_DEF) comment += ` - ${this.description}`;
        if (this.flags.FUNCTION_SCOPE || this.flags.METHOD_SCOPE || this.flags.CLASS_CONSTRUCTOR_DEF) {
            this.paramList.map(i => {
                comment += `\n * @${i.keyword} {${i.dtype.map(j=>j)}} ${i.name}`;
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
    constructor(props = {}) {
        this.keyword = props.keyword;
        this.dtype = props.type || 'any';
        this.name = props.name;
        this.description = props.description || 'none';
    }
}

class Comment{
    constructor(props = {}){
        
    }
}

module.exports = {
    Entity,
    SubEntity,
}