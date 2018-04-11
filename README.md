# Docanize
Automatically generate jsdoc style comments for your code to make documentation generation easier. 

## installation
`
npm install docanize -g
  or
yarn global add docanize
`

## usage

`
docanize [options]
`

## options
* -d or --dir : the directory on which you want to run docanize on
* -l or --linspace : the line spacing between the lines of comments (defaults to 1).


## examples
`
docanize -d='./dir' -l=1
`
generate comments for dir folder with line-space of 1

`
docanize
`
generate comments for root folder
