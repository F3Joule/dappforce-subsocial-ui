import React from 'react'
import ReactMarkdown from 'react-markdown';

interface Props {
  source?: string
}

export const DfMd = (props: Props) => {
  return <ReactMarkdown className='DfMd' source={props.source} linkTarget='_blank' />
}
