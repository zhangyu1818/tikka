import React from 'react'

interface B {
  name: string
}

export default (props: B) => <div>{props.name}</div>
