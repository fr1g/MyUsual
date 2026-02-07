/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useImperativeHandle, useRef } from "react";

const PopUpToastContainerClass = "toast-initial fixed p-3 #COLOR# border opacity-95 shadow-xl hover:shadow-2xl rounded-lg mx-auto max-w-max left-0 right-0 block";
const PopUpToastInnerClass = "block! use-icon px-2.5 mx-auto font-semibold text-lg";

const Toast = React.forwardRef(
    (props: any, ref: any) => {
        const state = {
            message: null,
            color: 'bg-white/50 dark:bg-black/50 backdrop-blur-md shadow-lg',
            toastArea: useRef<HTMLDivElement | null>(null),
            p: props
        };

        useImperativeHandle(ref, () => (
            {
                PushToast(str: string | null = state.message, ucolor = state.color, later = 0, disappear = 5000) {
                    if (str == null) return;
                    let color = ucolor;
                    setTimeout(() => {
                        switch (color) {
                            case "normal":
                                // do nothing on the color
                                break;
                            case "warn":
                                color = "bg-yellow-400";
                                break;
                            case "err":
                                color = "bg-[#fecaca]";
                                break;
                            case 'blur':
                                color = 'backdrop-blur-md'
                                break;
                            default:
                                break;
                        }
                        const containerC = PopUpToastContainerClass.replace('#COLOR#', color);
                        const nPopToast = document.createElement('div');
                        const nPopToastText = document.createElement('p');
                        nPopToastText.innerHTML = str.replace("\n", "<br>");
                        nPopToast.appendChild(nPopToastText);
                        // eslint-disable-next-line prefer-const
                        for (let ii of containerC.split(" ")) {
                            nPopToast.classList.add(ii);
                        }
                        // eslint-disable-next-line prefer-const
                        for (let ii of PopUpToastInnerClass.split(" ")) {
                            nPopToastText.classList.add(ii);
                        }
                        state.toastArea.current!.appendChild(nPopToast);

                        setTimeout(() => {
                            nPopToast.classList.replace('toast-initial', 'toast-leave')
                        }, disappear);
                        setTimeout(() => {
                            state.toastArea.current!.removeChild(nPopToast);
                        }, 787 + disappear);

                    }, later);
                },
            }
        ));

        return <div ref={state.toastArea} className="popup-container z-50 fixed taz select-none news-auto bottom-0! pointer-events-none" id="popup-container" >
        </div>
    }
)

export default Toast;
