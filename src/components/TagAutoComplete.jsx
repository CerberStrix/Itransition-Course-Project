import React, { useCallback, useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import ReactTags from 'react-tag-autocomplete'
import axios from 'axios';


function CustomTags ({ tags, setTags, suggestionsTags }) {
  
  const reactTags = useRef()

  const onDelete = useCallback((tagIndex) => {
    setTags(tags.filter((_, i) => i !== tagIndex))
  }, [tags])

  const onAddition = useCallback((newTag) => {
    setTags([...tags, newTag])
  }, [tags])

  const onValidate = useCallback((newTag) => {
    return /^[a-z]{3,12}$/i.test(newTag.name)
  })

  return (
    <>
      <p>Enter tags</p>
      <ReactTags
        allowNew
        newTagText='Create new tag:'
        ref={reactTags}
        tags={tags}
        suggestions={suggestionsTags}
        onDelete={onDelete}
        onAddition={onAddition}
        onValidate={onValidate}
      />
      <p style={{ margin: '0.25rem 0', color: 'gray' }}>
        <small><em>Tags must be 3–12 characters in length and only contain the letters A-Z</em></small>
      </p>
    </>
  )
}

export default CustomTags