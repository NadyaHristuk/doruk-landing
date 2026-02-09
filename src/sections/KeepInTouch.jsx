import { useState, useRef } from 'react';
// hooks
import { useTitleAnimation } from '../hooks';
// components
import AnimatedPathFollower from '../components/AnimatedPathFollower.jsx';
// config
import {
  translate,
  svgConfig,
  contactUrl,
  phoneRegex,
  emailRegex,
  nameMinLength,
  phoneMinLength,
  emailMinLength,
  inputMaxLength,
  commentMinLength,
  commentMaxLength
} from '../config';
// assets
import jpgBg from '../assets/jpg/keep-in-touch/keep-in-touch-bg.jpg';
import jpgBgWebp from '../assets/webp/keep-in-touch/keep-in-touch-bg.webp';

const NameInput = ({ value, setValue, lang }) => {
  return (
    <input
      required
      type="text"
      value={value}
      minLength={nameMinLength}
      maxLength={inputMaxLength}
      onChange={(e) => setValue(e.target.value)}
      placeholder={translate('keepInTouch.input.name', lang)}
      aria-label={translate('keepInTouch.input.name', lang)}
    />
  );
};

const KeepInTouch = ({ lang }) => {
  const entryRef = useRef(null),
    containerRef = useRef(null),
    [userName, setUserName] = useState(''),
    [userPhone, setUserPhone] = useState(''),
    [userEmail, setUserEmail] = useState(''),
    [userComment, setUserComment] = useState(''),
    [phoneOrEmail, setPhoneOrEmail] = useState(false), // phone
    [error, setError] = useState(false),
    [success, setSuccess] = useState(false),
    [serverError, setServerError] = useState(false),
    progress = useTitleAnimation(entryRef);

  const clearForm = () => {
    setUserName('');
    setUserPhone('');
    setUserEmail('');
    setUserComment('');
    setPhoneOrEmail(false);
    setSuccess(false);
  };

  const submit = async () => {
    try {
      if (phoneOrEmail) {
        if (!emailRegex.test(userEmail)) {
          setError(true);
          return;
        }
      } else {
        if (!phoneRegex.test(userPhone)) {
          setError(true);
          return;
        }
      }

      const response = await fetch(contactUrl, {
        body: JSON.stringify({
          userName,
          userPhone,
          userEmail,
          userComment
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        setServerError(true);
      } else {
        setSuccess(true);
        setTimeout(() => clearForm(), 4000);
      }
    } catch (error) {
      console.error('Server error:', error);
    }
  };

  return (
    <div className="keep-in-touch">
      <div className="backgrounds">
        <div className="top" ref={entryRef}>
          <h2
            className="animated-title"
            style={{ transform: `translateX(${progress}%)` }}
          >
            {translate('keepInTouch.title', lang)}
          </h2>
        </div>

        <div className="bottom">
          <div className="background-a" ref={containerRef}>
            <AnimatedPathFollower
              container={containerRef.current}
              offsetStart={0.2}
              config={svgConfig.keepInTouch}
            />
          </div>
        </div>
      </div>

      <div className="content">
        <div className="content-top">
          <div className="decoration">
            <picture>
              <source type="image/webp" srcSet={jpgBgWebp} />
              <img src={jpgBg} width="859" height="557" loading="lazy" alt="" role="presentation" aria-hidden="true" />
            </picture>
            <div className="input-name-mobile">
              <NameInput lang={lang} value={userName} setValue={setUserName} />
            </div>
          </div>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="flexible">
              <div className="inputs">
                <div className="input-name-desktop">
                  <NameInput
                    lang={lang}
                    value={userName}
                    setValue={setUserName}
                  />
                </div>
                <div className="contact-wrp">
                  {!phoneOrEmail ? (
                    <input
                      required
                      type="tel"
                      value={userPhone}
                      minLength={phoneMinLength}
                      maxLength={inputMaxLength}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder={translate('keepInTouch.input.phone', lang)}
                      aria-label={translate('keepInTouch.input.phone', lang)}
                    />
                  ) : (
                    <input
                      required
                      type="email"
                      value={userEmail}
                      minLength={emailMinLength}
                      maxLength={inputMaxLength}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder={translate('keepInTouch.input.email', lang)}
                      aria-label={translate('keepInTouch.input.email', lang)}
                    />
                  )}
                  <div className="switch-wrp">
                    {phoneOrEmail
                      ? translate('keepInTouch.a11y.togglePhone', lang)
                      : translate('keepInTouch.a11y.toggleEmail', lang)}
                    <div
                      className={`switch ${phoneOrEmail ? 'phone' : 'email'}`}
                      role="switch"
                      aria-checked={phoneOrEmail}
                      aria-label={translate(
                        'keepInTouch.a11y.toggleLabel',
                        lang
                      )}
                      onClick={() => setPhoneOrEmail((prev) => !prev)}
                    />
                  </div>
                </div>
              </div>
              <div className="textarea-wrp">
                <textarea
                  placeholder={translate('keepInTouch.input.comment', lang)}
                  value={userComment}
                  minLength={commentMinLength}
                  maxLength={commentMaxLength}
                  onChange={(e) => setUserComment(e.target.value)}
                  aria-label={translate('keepInTouch.input.comment', lang)}
                ></textarea>
                <div className="textarea-counter">
                  {userComment.length ?? 0} {translate('common.from', lang)}{' '}
                  {commentMaxLength} {translate('common.symbols', lang)}
                </div>
              </div>
            </div>
            <div className="submit-wrp">
              {serverError && (
                <div
                  className="message error-message"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="close" onClick={() => setServerError(false)}>
                    ✖
                  </div>
                  <div className="message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.errorHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  {translate('keepInTouch.messages.server', lang)}
                </div>
              )}
              {error && (
                <div
                  className="message error-message"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="close" onClick={() => setError(false)}>
                    ✖
                  </div>
                  <div className="message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.errorHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  {translate('keepInTouch.messages.fillForm', lang)}
                </div>
              )}
              {success && (
                <div
                  className="message success-message"
                  role="status"
                  aria-live="polite"
                >
                  <div className="close" onClick={() => clearForm()}>
                    ✖
                  </div>
                  <div className="message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.successHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  {translate('keepInTouch.messages.success', lang)}
                </div>
              )}
              <button
                type="submit"
                disabled={
                  !userName ||
                  (phoneOrEmail ? !userEmail : !userPhone) ||
                  !userComment
                }
              >
                <i className="icon-about-arrow" />
                <span>{translate('keepInTouch.button', lang)}</span>
                <i className="icon-about-arrow" />
              </button>
            </div>
          </form>
        </div>
        <div className="content-bottom">
          <div className="text-block">
            <div className="text">{translate('keepInTouch.text', lang)}</div>
            <div className="email">{translate('keepInTouch.email', lang)}</div>
            <div className="phone">{translate('keepInTouch.phone', lang)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeepInTouch;
