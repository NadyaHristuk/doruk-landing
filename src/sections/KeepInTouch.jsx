import { useState, useRef } from 'react';
// hooks
import { useTitleAnimation } from '../hooks';
import { useMatrixDots } from '../hooks/useMatrixDots';
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
import SvgDotsLeft from '../assets/svg/animations/about-dots-left.svg?react';
import SvgDotsRight from '../assets/svg/animations/about-dots-right.svg?react';

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

  const title = `${translate('keepInTouch.title', lang) || ''}`;
  const titleChars = Array.from(title);
  const titleInitial = titleChars[0] || '';
  const titleRest = titleChars.slice(1).join('');

  useMatrixDots({
    sectionId: '#keep-in-touch',
    svgSelector: '.keep-in-touch__dots--left',
    bucketSize: 40,
    minTailLength: 5,
    maxTailLength: 12,
    minHeadOpacity: 0.9,
    maxHeadOpacity: 1.0,
    baseOpacity: 0.05,
    minDuration: 6000,
    maxDuration: 12000
  });

  useMatrixDots({
    sectionId: '#keep-in-touch',
    svgSelector: '.keep-in-touch__dots--right',
    bucketSize: 40,
    minTailLength: 5,
    maxTailLength: 12,
    minHeadOpacity: 0.9,
    maxHeadOpacity: 1.0,
    baseOpacity: 0.05,
    minDuration: 6000,
    maxDuration: 12000
  });

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
      const hasEmptyRequiredFields =
        !userName.trim() ||
        !userComment.trim() ||
        (phoneOrEmail ? !userEmail.trim() : !userPhone.trim());

      if (hasEmptyRequiredFields) {
        setError(true);
        return;
      }

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
    } catch {
      setServerError(true);
    }
  };

  return (
    <div className="keep-in-touch">
      <div className="keep-in-touch__header" ref={entryRef}>
        <h2
          className="animated-title"
          style={{ transform: `translateX(${progress}%)` }}
          aria-label={title}
        >
          <span className="animated-title__cap">{titleInitial}</span>
          <span className="animated-title__text">{titleRest}</span>
        </h2>
      </div>
      <div className="keep-in-touch__backgrounds">
        <div className="keep-in-touch__bg">
          <div className="keep-in-touch__bg-line" ref={containerRef}>
            <AnimatedPathFollower
              container={containerRef.current}
              offsetStart={0.2}
              config={svgConfig.keepInTouch}
            />
          </div>
          <div className="keep-in-touch__bg-dots" aria-hidden="true">
            <SvgDotsLeft className="keep-in-touch__dots--left" />
            <SvgDotsRight className="keep-in-touch__dots--right" />
          </div>
        </div>
      </div>

      <div className="keep-in-touch__content">
        <div className="keep-in-touch__top">
          <div className="keep-in-touch__figure">
            <picture>
              <source type="image/webp" srcSet={jpgBgWebp} />
              <img src={jpgBg} width="630" height="350" loading="lazy" alt="" role="presentation" aria-hidden="true" />
            </picture>
            <div className="keep-in-touch__name--mobile">
              <NameInput lang={lang} value={userName} setValue={setUserName} />
            </div>
          </div>
          <form
            className="keep-in-touch__form"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <div className="keep-in-touch__form-fields">
              <div className="keep-in-touch__inputs">
                <div className="keep-in-touch__name--desktop">
                  <NameInput
                    lang={lang}
                    value={userName}
                    setValue={setUserName}
                  />
                </div>
                <div className="keep-in-touch__contact">
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
                  <div className="keep-in-touch__switch-wrap">
                    {phoneOrEmail
                      ? translate('keepInTouch.a11y.togglePhone', lang)
                      : translate('keepInTouch.a11y.toggleEmail', lang)}
                    <div
                      className={`keep-in-touch__switch ${phoneOrEmail ? 'keep-in-touch__switch--phone' : 'keep-in-touch__switch--email'}`}
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
              <div className="keep-in-touch__textarea-wrap">
                <textarea
                  placeholder={translate('keepInTouch.input.comment', lang)}
                  value={userComment}
                  minLength={commentMinLength}
                  maxLength={commentMaxLength}
                  onChange={(e) => setUserComment(e.target.value)}
                  aria-label={translate('keepInTouch.input.comment', lang)}
                ></textarea>
                <div className="keep-in-touch__textarea-counter">
                  {userComment.length ?? 0} {translate('common.from', lang)}{' '}
                  {commentMaxLength} {translate('common.symbols', lang)}
                </div>
              </div>
            </div>
            <div className="keep-in-touch__submit">
              {serverError && (
                <div
                  className="keep-in-touch__message"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="keep-in-touch__close" onClick={() => setServerError(false)}>
                    ✖
                  </div>
                  <div className="keep-in-touch__message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.errorHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  <p className="keep-in-touch__message-text">
                    {translate('keepInTouch.messages.server', lang)}
                  </p>
                </div>
              )}
              {error && (
                <div
                  className="keep-in-touch__message"
                  role="alert"
                  aria-live="assertive"
                >
                  <div className="keep-in-touch__close" onClick={() => setError(false)}>
                    ✖
                  </div>
                  <div className="keep-in-touch__message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.errorHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  <p className="keep-in-touch__message-text">
                    {translate('keepInTouch.messages.fillForm', lang)}
                  </p>
                </div>
              )}
              {success && (
                <div
                  className="keep-in-touch__message keep-in-touch__message--success"
                  role="status"
                  aria-live="polite"
                >
                  <div className="keep-in-touch__close" onClick={() => clearForm()}>
                    ✖
                  </div>
                  <div className="keep-in-touch__message-header">
                    <i className="icon-about-arrow" />
                    {translate('keepInTouch.messages.successHeader', lang)}
                    <i className="icon-about-arrow" />
                  </div>
                  <p className="keep-in-touch__message-text">
                    {translate('keepInTouch.messages.success', lang)}
                  </p>
                </div>
              )}
              <button
                type="submit"
              >
                <i className="icon-about-arrow" />
                <span>{translate('keepInTouch.button', lang)}</span>
                <i className="icon-about-arrow" />
              </button>
            </div>
          </form>
        </div>
        <div className="keep-in-touch__contact-card">
          <div className="keep-in-touch__contact-info">
            <div className="keep-in-touch__contact-label">{translate('keepInTouch.text', lang)}</div>
            <div className="keep-in-touch__email">{translate('keepInTouch.email', lang)}</div>
            <div className="keep-in-touch__phone">{translate('keepInTouch.phone', lang)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KeepInTouch;
