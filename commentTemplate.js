`
/**
 * @${Entity} ${Entity.name} ${CLASS_FLAG ? '@extends' : ''} - ${Entity.description}
 * // for all subEntities do:
 * @${subEntity} {${subEntity.typeList.join('|')}} ${subEntity.name} - ${subEntity.description}
 *  
 * ${()=>{ if(METHOD_FLAG || FUNCTION_FLAG) return '@returns' }}
 * 
*/
`