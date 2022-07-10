/** @format */

import React, { useEffect, useRef, useState } from 'react'
import './OldCss.css'
import videoMov from '../assets/video.mov'
import videoMov2 from '../assets/h265Vid.mp4'
import videoMov3 from '../assets/vidAv1.mp4'
import logo from '../assets/logo.png'
import luk from '../assets/luka.png'
import lukBg from '../assets/luka.jpg'
import huilo from '../assets/huilo.jpg'
import smokeImg from '../assets/smoke.png'
import huiloNoBg from '../assets/huilo.png'
import walletIcon from '../assets/walletIcon.svg'
import metaIcon from '../assets/metalogo.svg'
import exitIcon from '../assets/exit.svg'
import huilos from '../assets/both.jpg'
import map from '../assets/map.svg'
import { Mainnet, DAppProvider, useEtherBalance, useEthers, Config, useLookupAddress, shortenAddress } from '@usedapp/core'
import { getDefaultProvider } from 'ethers'
import { formatEther } from '@ethersproject/units'
import Typewriter from 'typewriter-effect'
import WalletConnect from '@walletconnect/client'
import QRCodeModal from '@walletconnect/qrcode-modal'
import Lines from './Lines'

const MainPage = () => {
    const { account, library, activateBrowserWallet, deactivate, error } = useEthers()
    const etherBalance = useEtherBalance(account)
    let canvas = document.getElementById('smoke')
    const [toggleModal, setToggleModal] = useState(false)
    const [showPlayBtn, setShowPlayBtn] = useState(false)
    const [tokensInput, setTokensInput] = useState(0)

    const vidRef = useRef()

    const connector = new WalletConnect({
        bridge: 'https://bridge.walletconnect.org', // Required
        qrcodeModal: QRCodeModal
    })

    const checkField = () => {
        let replaced = tokensInput.toString()
        setTokensInput(replaced.replace(',', '.'))
    }

    const uri = connector.uri

    const [rendered, setRendered] = useState('')

    const tabsEl = document.querySelectorAll('.accordion')
    const contentEl = document.querySelectorAll('.accordion-content')

    const showText = event => {
        for (let i = 0; i < tabsEl.length; i++) {
            if (tabsEl[i].children[0] === event.target && tabsEl[i].classList.length === 1) {
                tabsEl[i].classList.add('open')
                contentEl[i].style.display = 'block'
            } else if (tabsEl[i].children[0] === event.target && tabsEl[i].classList.length === 2) {
                tabsEl[i].classList.remove('open')
                contentEl[i].style.display = 'none'
            } else {
                tabsEl[i].classList.remove('open')
                contentEl[i].style.display = 'none'
            }
        }
    }

    const playVideo = () => {
        vidRef.current.play()
        setShowPlayBtn(false)
    }

    const ens = useLookupAddress()

    useEffect(() => {
        if (ens) {
            setRendered(ens)
        } else if (account) {
            setRendered(shortenAddress(account))
        } else {
            setRendered('')
        }
    }, [])
    // }, [account, ens, setRendered])

    useEffect(() => {
        if (error) {
            console.error('Error while connecting wallet:', error.message)
        }
    }, [error])

    const animate = () => {
        function assignAnim() {
            var requestAnimationFrame =
                window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame
            window.requestAnimationFrame = requestAnimationFrame
        }

        assignAnim()

        let par = {
            r: 255,
            g: 255,
            b: 255
        }

        let ctx = canvas.getContext('2d', par)

        let loading = true

        canvas.height = 1000
        canvas.width = 500

        var parts = [],
            minSpawnTime = 40,
            lastTime = new Date().getTime(),
            maxLifeTime = 20000,
            emitterX = canvas.width / 2,
            emitterY = canvas.height - 100,
            smokeImage = new Image()

        function spawn() {
            if (new Date().getTime() > lastTime + minSpawnTime) {
                lastTime = new Date().getTime()
                parts.push(new smoke(emitterX, emitterY))
            }
        }

        function render() {
            if (loading) {
                load()
                return false
            }

            var len = parts.length
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            while (len--) {
                if (parts[len].y < 0 || parts[len].lifeTime > maxLifeTime) {
                    parts.splice(len, 1)
                } else {
                    parts[len].update()

                    ctx.save()
                    var offsetX = -parts[len].size / 2,
                        offsetY = -parts[len].size / 2

                    ctx.translate(parts[len].x - offsetX, parts[len].y - offsetY)
                    ctx.rotate((parts[len].angle / 180) * Math.PI)
                    ctx.globalAlpha = parts[len].alpha
                    ctx.drawImage(smokeImage, offsetX, offsetY, parts[len].size, parts[len].size)
                    ctx.restore()
                }
            }
            spawn()
            requestAnimationFrame(render)
        }

        function smoke(x, y, index) {
            this.x = x
            this.y = y

            this.size = 1
            this.startSize = 32
            this.endSize = 40

            this.angle = Math.random() * 359

            this.startLife = new Date().getTime()
            this.lifeTime = 0

            this.velY = -1 - Math.random() * 0.5
            this.velX = Math.floor(Math.random() * -6 + 3) / 10
        }

        smoke.prototype.update = function () {
            this.lifeTime = new Date().getTime() - this.startLife
            this.angle += 0.2

            var lifePerc = (this.lifeTime / maxLifeTime) * 10

            this.size = this.startSize + (this.endSize - this.startSize) * lifePerc * 0.1

            this.alpha = 1 - lifePerc * 0.01
            this.alpha = Math.max(this.alpha, 0)

            this.x += this.velX
            this.y += this.velY
        }

        smokeImage.src = smokeImg
        smokeImage.onload = function () {
            loading = false
        }

        function load() {
            if (loading) {
                setTimeout(load, 100)
            } else {
                render()
            }
        }

        var origImage = smokeImage
    }

    useEffect(() => {
        if (canvas) animate()
    }, [canvas])

    return (
        <div className='wrapper'>
            {etherBalance && (
                <div className='balance'>
                    <br />
                    Balance:
                    <p className='bold'>{formatEther(etherBalance)}</p>
                </div>
            )}
            <div className='layout'>
                <header id='header'>
                    <div className='limit'>
                        <div className='menu-button'>
                            {/* <?xml version="1.0" ?><svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M4 12H12M4 18H20" stroke="#4A5568" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg> */}
                        </div>
                        <a href='' className='logo'>
                            <img src={logo} alt='' />
                        </a>
                        <ul className='nav'>
                            <li>
                                <a href='#description'>Description</a>
                            </li>

                            <li>
                                <a href='#bet'>Make a bet</a>
                            </li>
                            <li>
                                <a href='#roadmap'>Roadmap</a>
                            </li>
                            <li>
                                <a href='#faq'>FAQ</a>
                            </li>
                        </ul>

                        {!account ? (
                            <a
                                onClick={() => {
                                    if (!account) {
                                        activateBrowserWallet()
                                    } else {
                                        deactivate()
                                    }
                                }}
                                href='#'
                                className='wallet-button popup-button'
                            >
                                <svg width='23' height='20' viewBox='0 0 23 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        fillRule='evenodd'
                                        clipRule='evenodd'
                                        d='M15.7516 0.504732C15.6576 0.544342 2.73938 3.97904 1.72959 4.23291C1.13966 4.38123 0.308156 5.19076 0.131589 5.78868C-0.0438631 6.38294 -0.0438631 17.2264 0.131589 17.8206C0.295905 18.3771 1.13459 19.2163 1.69072 19.3808C2.29108 19.5583 20.4041 19.5583 21.0045 19.3808C21.5606 19.2163 22.3993 18.3771 22.5636 17.8206C22.6338 17.5829 22.6867 16.8115 22.6867 16.0259V14.648L18.7456 14.6194C14.9463 14.5916 14.7944 14.5831 14.525 14.3817C13.8526 13.8792 13.828 13.7882 13.828 11.8047C13.828 9.82108 13.8526 9.73011 14.525 9.22763C14.7944 9.02623 14.9463 9.01772 18.7456 8.98996L22.6867 8.96129V7.58342C22.6867 5.8681 22.5905 5.52194 21.9308 4.86172C21.3295 4.26006 20.9 4.10537 19.8308 4.10537H19.0739L18.8028 3.06698C18.6535 2.49581 18.406 1.82465 18.2526 1.57534C17.867 0.949062 17.2002 0.553257 16.4444 0.502098C16.119 0.480114 15.8073 0.481228 15.7516 0.504732ZM16.7113 2.25977C16.8509 2.37293 17.0211 2.74178 17.1669 3.2475L17.3996 4.05471L15.2917 4.08207C14.1323 4.09706 12.1905 4.09706 10.9767 4.08207L8.76976 4.05471L12.4126 3.07447C14.4161 2.53532 16.1528 2.09089 16.2719 2.08673C16.3911 2.08258 16.5888 2.16049 16.7113 2.25977ZM15.3973 11.8047V13.0203H19.042H22.6867V11.8047V10.589H19.042H15.3973V11.8047Z'
                                        fill='white'
                                    />
                                </svg>
                                Connect wallet
                            </a>
                        ) : (
                            <a onClick={() => deactivate()} href='#' className='wallet-button popup-button'>
                                {/* //import quit icon */}
                                <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
                                    <path
                                        fill='#000'
                                        d='M6 2C3.79086 2 2 3.79086 2 6V9H4V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V15H2V18C2 20.2091 3.79086 22 6 22H18C20.2091 22 22 20.2091 22 18V6C22 3.79086 20.2091 2 18 2H6Z'
                                    />
                                    <path
                                        fill='#000'
                                        d='M3 11C2.44772 11 2 11.4477 2 12C2 12.5523 2.44772 13 3 13H12.5825L10.0469 15.5355C9.6564 15.9261 9.6564 16.5592 10.0469 16.9498C10.4374 17.3403 11.0706 17.3403 11.4611 16.9498L15.6568 12.7541C15.8671 12.5707 16 12.3009 16 12C16 11.6991 15.8671 11.4293 15.6568 11.2459L11.4611 7.05025C11.0706 6.65972 10.4374 6.65972 10.0469 7.05025C9.6564 7.44077 9.6564 8.07394 10.0469 8.46446L12.5825 11H3Z'
                                    />
                                </svg>
                                {account?.substr(0, 6) + '...' + account?.substr(account?.length - 5, account?.length)}
                            </a>
                        )}
                    </div>
                </header>

                <div className='main-block' id='main-block'>
                    <div className='video-container'>
                        {showPlayBtn && (
                            <div onClick={() => playVideo()} className='play-btn'>
                                <svg width='50px' height='50px' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                                    <path
                                        fill='none'
                                        stroke='#27ff32'
                                        strokeWidth='2'
                                        d='M3,22.0000002 L21,12 L3,2 L3,22.0000002 Z M5,19 L17.5999998,11.9999999 L5,5 L5,19 Z M7,16 L14.1999999,12 L7,8 L7,16 Z M9,13 L10.8,12 L9,11 L9,13 Z'
                                    ></path>
                                </svg>
                            </div>
                        )}

                        <video width='320' ref={vidRef} autoPlay onEnded={() => setShowPlayBtn(true)} muted height='240'>
                            <source src={videoMov} type='video/mov' />
                            <source src={videoMov2} type='video/mp4' />
                            <source src={videoMov3} type='video/mp4' />
                        </video>

                        {/* <video src={videoMov} autoPlay muted></video> */}
                    </div>
                    <a href={'#description'} className='mouse'></a>
                </div>

                <div className='description' id='description'>
                    <div className='skull'></div>
                    <div className='round-smoke'>
                        <div className='circle'></div>
                        <svg>
                            <filter id='wave'>
                                <feTurbulence x='0' y='0' baseFrequency='0.009' numOctaves='5' seed='2'>
                                    <animate attributeName='baseFrequency' dur='30s' values='0.02;0.005;0.02' repeatCount='indefinite' />
                                </feTurbulence>
                                <feDisplacementMap in='SourceGraphic' scale='30' />
                            </filter>
                        </svg>
                    </div>
                    <div className='limit'>
                        <div className='text'>
                            <h2 data-title='Description'>Description</h2>
                            {/* <div className='content' id='textContainer'>
                                Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum nunc
                                aliquet bibendum. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin.
                            </div> */}
                            <Typewriter
                                options={{
                                    strings: [
                                        `Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin.`
                                    ],
                                    autoStart: true,
                                    delay: 20,
                                    loop: false,
                                    cursor: '',
                                    pauseFor: 99999999
                                }}
                            />
                        </div>

                        <div className='pic-container'>
                            <div className='lu'>
                                <img src={luk} alt='' />
                            </div>
                            <div className='pu'>
                                <img src={huiloNoBg} alt='' />
                            </div>
                            <img src={map} alt='' />
                            <div className='tanks'></div>
                            <div className='tanks be'></div>
                        </div>
                    </div>
                    <canvas id='smoke'></canvas>
                </div>

                <div className='bet-block' id='bet'>
                    <div className='limit'>
                        <h2>
                            Who <span>dies</span> first?
                        </h2>
                        <p>Choose an option and place your bet</p>
                        <p>
                            Total stake pool:
                            <span data-coin='eth'>253</span>
                        </p>
                        {toggleModal ? (
                            !account ? (
                                <div className={toggleModal ? 'overlay--active overlay' : 'overlay'}>
                                    <div className='popup connect-popup'>
                                        <span onClick={() => setToggleModal(!toggleModal)} class='cross close-popup'></span>
                                        <div className='heading'>Connect Wallet</div>
                                        <div className='connect-popup-wallets'>
                                            <div onClick={() => QRCodeModal.open(uri)} className='wallet-card-wrapper'>
                                                <img src={walletIcon} alt='WalletConnect' />
                                                <div className='wallet-card-content'>
                                                    <b>WalletConnect</b>
                                                    <span>Scan with WalletConnect to connect</span>
                                                </div>
                                            </div>
                                            <div class='wallet-card-wrapper' onClick={() => activateBrowserWallet()}>
                                                <img src={metaIcon} alt='Metamask' />
                                                <div class='wallet-card-content'>
                                                    <b>Metamask</b>
                                                    <span>Connect with the provider in your Browser</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={toggleModal ? 'overlay--active overlay' : 'overlay'}>
                                    <div className='popup connect-popup'>
                                        <span onClick={() => setToggleModal(!toggleModal)} class='cross close-popup'></span>
                                        <div className='heading'>Make a bet</div>
                                        <form className='form-wrapper' novalidate=''>
                                            <div className='form-row'>
                                                <label>
                                                    <span>Your bet</span>
                                                    <input name='betTokens' type='number' onChange={e => setTokensInput(e)} className='tokens-input' />
                                                </label>
                                            </div>
                                            <button className='button test' onClick={e => checkField(e)}>
                                                BET
                                            </button>
                                            <input type='hidden' name='id' value='2' />
                                        </form>
                                        <div className='popup-bet-your-bet'>Your bet: 0.0</div>
                                    </div>
                                </div>
                            )
                        ) : (
                            ''
                        )}
                        <div className='bets-container'>
                            <div className='bets-card' data-id='1'>
                                <div className='pic'>
                                    <img src={huilo} alt='' />
                                </div>
                                <div className='name'>Putin</div>
                                <div className='coef'>
                                    Coef: <span>1.51</span>
                                </div>
                                <a href='#bet-popup' onClick={() => setToggleModal(!toggleModal)} className='button popup-button'>
                                    make a BET
                                </a>
                            </div>
                            <div className='bets-card' data-id='2'>
                                <div className='pic'>
                                    <img src={lukBg} alt='' />
                                </div>
                                <div className='name'>Lukashenko</div>
                                <div className='coef'>
                                    Coef: <span>4.20</span>
                                </div>
                                <a href='#bet-popup' onClick={() => setToggleModal(!toggleModal)} className='button popup-button'>
                                    make a BET
                                </a>
                            </div>
                            <div className='bets-card' data-id='3'>
                                <div className='pic'>
                                    <img src={huilos} alt='' />
                                </div>
                                <div className='name'>Both together</div>
                                <div className='coef'>
                                    Coef: <span>5.0</span>
                                </div>
                                <a href='#bet-popup' onClick={() => setToggleModal(!toggleModal)} className='button popup-button'>
                                    make a BET
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='skull skull1'></div>
                    <div className='skull skull2'></div>
                    <div className='popup' id='bet-popup' style={{ display: 'none' }}>
                        <a href='#' className='cross close-popup'></a>
                        <div className='heading'>Make a bet</div>
                        <form action=''>
                            <div className='form-row'>
                                <label>
                                    Your bet
                                    {/* <input type='text' name='bet' value='25' /> */}
                                </label>
                            </div>
                            <button type='submit' className='button'>
                                BET
                            </button>
                            <input type='hidden' name='id' />
                        </form>
                    </div>
                </div>

                <div className='road-map' id='roadmap'>
                    <div className='skull'></div>
                    <div className='round-smoke'>
                        <div className='circle'></div>
                        <svg>
                            <filter id='wave'>
                                <feTurbulence x='0' y='0' baseFrequency='0.009' numOctaves='5' seed='2'>
                                    <animate attributeName='baseFrequency' dur='30s' values='0.02;0.005;0.02' repeatCount='indefinite' />
                                </feTurbulence>
                                <feDisplacementMap in='SourceGraphic' scale='30' />
                            </filter>
                        </svg>
                    </div>

                    <div className='limit'>
                        <h2 data-title='Roadmap' className='visible'>
                            Roadmap
                        </h2>

                        <div className='road-map-container'>
                            <div className='road-map-item'>
                                <Lines />
                                <div className='date'>12.06.2022</div>
                                <div className='title'>Point name</div>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>

                            <div className='road-map-item'>
                                <Lines />

                                <div className='date'>12.06.2022</div>
                                <div className='title'>Point name</div>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                            <div className='road-map-item'>
                                <Lines />

                                <div className='date'>12.06.2022</div>
                                <div className='title'>Point name</div>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='faq' id='faq'>
                    <div className='limit'>
                        <h2 data-title='FAQ' className='visible'>
                            FAQ
                        </h2>
                        <div className='accordion' onClick={e => showText(e)}>
                            <div className='title'>Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus</div>
                            <div className='accordion-content'>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                        <div className='accordion' onClick={e => showText(e)}>
                            <div className='title'>Risus nec feugiat in fermentum posuere. In mollis nunc</div>
                            <div className='accordion-content'>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                        <div className='accordion' onClick={e => showText(e)}>
                            <div className='title'>Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus</div>
                            <div className='accordion-content'>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                        <div className='accordion' onClick={e => showText(e)}>
                            <div className='title'>Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus</div>
                            <div className='accordion-content'>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                        <div className='accordion' onClick={e => showText(e)}>
                            <div className='title'>Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus</div>
                            <div className='accordion-content'>
                                <p>
                                    Risus nec feugiat in fermentum posuere. In mollis nunc sed id semper risus. Eget lorem dolor sed viverra ipsum
                                    nunc aliquet bibendum.
                                </p>
                                <p>Id cursus metus aliquam eleifend mi in nulla posuere sollicitudin. Nullam ac tortor vitae purus faucibus</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <footer id='footer'>
                <div className='round-smoke'>
                    <div className='circle'></div>
                    <svg>
                        <filter id='wave'>
                            <feTurbulence x='0' y='0' baseFrequency='0.009' numOctaves='5' seed='2'>
                                <animate attributeName='baseFrequency' dur='30s' values='0.02;0.005;0.02' repeatCount='indefinite' />
                            </feTurbulence>
                            <feDisplacementMap in='SourceGraphic' scale='30' />
                        </filter>
                    </svg>
                </div>
                <div className='limit'>
                    <a href='' className='logo'>
                        <img src={logo} alt='' />
                    </a>
                    <p>
                        Total stake pool: <span data-coin='eth'>253</span>
                    </p>

                    <div className='links'>
                        <a href='#' target='_blank'>
                            <svg width='18' height='16' viewBox='0 0 18 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <path
                                    d='M17.5847 2.08785L14.9696 14.4517C14.7723 15.3243 14.2578 15.5415 13.5266 15.1304L9.54208 12.1868L7.61942 14.0406C7.40665 14.2539 7.2287 14.4323 6.81864 14.4323L7.10491 10.364L14.4899 3.67405C14.811 3.38706 14.4203 3.22806 13.9909 3.51505L4.86117 9.27811L0.930756 8.04483C0.0758132 7.77723 0.0603391 7.18774 1.10871 6.77664L16.4822 0.839063C17.194 0.571464 17.8168 0.99807 17.5847 2.08785Z'
                                    fill='white'
                                />
                            </svg>
                        </a>
                        <a href='#' target='_blank'>
                            <svg width='20' height='21' viewBox='0 0 20 21' fill='none' xmlns='http://www.w3.org/2000/svg'>
                                <g clipPath='url(#clip0_86_27458)'>
                                    <path
                                        d='M17.6748 6.12509C17.687 6.29558 17.687 6.46612 17.687 6.63662C17.687 11.837 13.718 17.8291 6.46368 17.8291C4.22877 17.8291 2.15265 17.1836 0.40625 16.0632C0.723788 16.0997 1.02907 16.1119 1.35883 16.1119C3.20289 16.1119 4.90047 15.4908 6.25606 14.4312C4.52188 14.3947 3.06858 13.262 2.56785 11.7031C2.81213 11.7396 3.05636 11.764 3.31285 11.764C3.667 11.764 4.02119 11.7152 4.35091 11.63C2.54346 11.2646 1.18782 9.68137 1.18782 7.76926V7.72056C1.71294 8.01286 2.32362 8.19554 2.97084 8.21987C1.90834 7.51348 1.21226 6.30777 1.21226 4.94371C1.21226 4.21298 1.40762 3.54313 1.74959 2.95853C3.6914 5.34562 6.61022 6.90451 9.88315 7.07505C9.8221 6.78275 9.78545 6.4783 9.78545 6.17382C9.78545 4.00593 11.5441 2.23999 13.7301 2.23999C14.8659 2.23999 15.8917 2.71497 16.6123 3.48225C17.5038 3.31175 18.3586 2.9829 19.1159 2.53229C18.8227 3.44574 18.1999 4.21302 17.3817 4.70014C18.1755 4.61493 18.9449 4.39566 19.6532 4.09122C19.1159 4.87064 18.4442 5.56482 17.6748 6.12509Z'
                                        fill='white'
                                    />
                                </g>
                                <defs>
                                    <clipPath id='clip0_86_27458'>
                                        <rect width='19.9437' height='19.9437' fill='white' transform='translate(0.0546875 0.0622559)' />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </div>

                    <div className='copyright'>Copyright - 2022 Dead Dictator. All rights reserved</div>
                </div>
            </footer>
        </div>
    )
}

export default MainPage
