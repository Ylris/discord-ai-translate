/*
 * AiTranslate, a Vencord userplugin
 * Copyright (c) 2026 Ylris
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import { Flex } from "@components/Flex";
import { Heading } from "@components/Heading";
import { Paragraph } from "@components/Paragraph";
import { Margins } from "@utils/margins";
import { RenderModalProps } from "@vencord/discord-types";
import { Modal, openModal, TextArea, useState } from "@webpack/common";

interface PreviewProps {
    modalProps: RenderModalProps;
    original: string;
    translation: string;
    targetLanguage: string;
    onConfirm(text: string | null): void;
}

const OutgoingPreview = ErrorBoundary.wrap(function OutgoingPreview({ modalProps, original, translation, targetLanguage, onConfirm }: PreviewProps) {
    const [text, setText] = useState(translation);

    function confirm() {
        if (!text.trim()) return;
        onConfirm(text);
        modalProps.onClose();
    }

    return (
        <Modal
            {...modalProps}
            title="确认翻译后发送"
            actions={[
                { text: "取消", variant: "secondary", onClick: modalProps.onClose },
                { text: "确认发送", variant: "primary", onClick: confirm, disabled: !text.trim() }
            ]}
        >
            <Flex flexDirection="column" gap={16}>
                <section>
                    <Heading className={Margins.bottom8}>原文</Heading>
                    <Paragraph className="vc-aitrans-preview-original">{original}</Paragraph>
                </section>
                <section>
                    <Heading className={Margins.bottom8}>译文（{targetLanguage}，可修改）</Heading>
                    <TextArea value={text} onChange={setText} autosize />
                </section>
            </Flex>
        </Modal>
    );
}, { noop: false, onError: ({ props }) => props.onConfirm(null) });

export function previewOutgoingTranslation(original: string, translation: string, targetLanguage: string): Promise<string | null> {
    return new Promise(resolve => {
        openModal(modalProps => (
            <OutgoingPreview
                modalProps={modalProps}
                original={original}
                translation={translation}
                targetLanguage={targetLanguage}
                onConfirm={resolve}
            />
        ), { onCloseCallback: () => resolve(null) });
    });
}
