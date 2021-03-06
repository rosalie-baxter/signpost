import React from 'react'
import { Link } from 'react-router-dom'
import { Close } from '../Buttons/buttons.js'
import './HelpPage.css'

const instructions = [
  'Zoom in',
  'Zoom out',
  'Location of service',
  'Search',
  'See more information',
  'You are here',
]

// Close needs to return to populated map
const Help = () => {
  return (
    <>
      <Link to="/map">
        <Close />
      </Link>
      <section>
        <h1> Need help? </h1>
        <article className="help-panel">
          {instructions.map(instruction => (
            <a
              className="help-panel__icon"
              value={instruction}
              key={instruction}
            >
              <figure>
                <img
                  className="help-panel__image"
                  src={require(`../../assets/${instruction}.svg`)}
                  alt={instruction}
                />
                <figcaption className="help-text">{instruction}</figcaption>
              </figure>
            </a>
          ))}
        </article>
      </section>
    </>
  )
}

export default Help
