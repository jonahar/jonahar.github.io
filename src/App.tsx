import { FC } from 'react'

const App: FC = () => {
  return (
    <div id="center_container">
      <div id="main">
        <div id="main_primary">
          <header>Jona Harris</header>

          <div className="section">
            <div className="section_title">About</div>
            <div className="section_content">
              I&apos;m a M.Sc. graduate of{' '}
              <a href="https://cs.huji.ac.il/">The Hebrew University of Jerusalem</a>. My research
              interests include cryptocurrency protocols, cryptography and security. I&apos;m also
              passionate about coding and designing large systems.
            </div>
          </div>

          <div className="section">
            <div className="section_title">Publications &amp; Projects</div>
            <div className="section_content">
              <ul>
                <li>
                  <span className="publication_title">
                    Flood &amp; Loot: A Systemic Attack On The Lightning Network
                  </span>
                  ,{' '}
                  <span className="publication_body">
                    Jona Harris and Aviv Zohar, in ACM conference on Advances in Financial
                    Technologies (AFT&apos;20).{' '}
                    <a href="https://dl.acm.org/doi/10.1145/3419614.3423248">ACM</a>,{' '}
                    <a href="https://link.medium.com/tUq7jDxeIab">Medium</a>,{' '}
                    <a href="https://youtu.be/oWfoVojRs90">YouTube</a>
                  </span>
                </li>
                <li>
                  <span className="publication_title">The Cryptocurrency Filter-Bubble.</span>{' '}
                  <span className="publication_body">
                    Jona Harris and Aviv Zohar. 2018.{' '}
                    <a href="https://medium.com/blockchains-huji/the-cryptocurrency-filter-bubble-faa0901f0e0a">
                      Medium
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="section">
            <div className="section_title">Contact</div>
            <div className="section_content">
              For any question, collaboration opportunities or asking for ransom, please contact me
              at <a href="mailto:jonahar@gmail.com">jonahar@gmail.com</a>.
            </div>
          </div>
        </div>

        <div id="main_secondary">
          <div id="profile_pic_container">
            <div id="profile_pic_inner">
              <img src={`${import.meta.env.BASE_URL}profile.jpg`} width="100%" alt="Jona Harris" />
            </div>
          </div>

          <div id="social_buttons">
            <span className="icon">
              <a href="https://www.linkedin.com/in/jona-harris" aria-label="LinkedIn">
                <i className="fa fa-linkedin-square" />
              </a>
            </span>

            <span className="icon">
              <a href="https://github.com/jonahar" aria-label="GitHub">
                <i className="fa fa-github-square" />
              </a>
            </span>
          </div>
        </div>
      </div>

      <div id="epilogue">
        <hr className="solid" />
        <div className="quote">
          &ldquo;Not everyone can become a great artist,
          <br />
          but a great artist can come from anywhere&rdquo;
        </div>
      </div>
    </div>
  )
}

export default App
