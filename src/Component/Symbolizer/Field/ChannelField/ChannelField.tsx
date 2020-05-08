/* Released under the BSD 2-Clause License
 *
 * Copyright (c) 2018-present, terrestris GmbH & Co. KG
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * * Redistributions of source code must retain the above copyright notice,
 *   this list of conditions and the following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above copyright notice,
 *   this list of conditions and the following disclaimer in the documentation
 *   and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

import * as React from 'react';

import {
    Channel,
    ContrastEnhancement
} from 'geostyler-style';
import SourceChannelNameField from '../SourceChannelNameField/SourceChannelNameField';
import { Form } from 'antd';
import { localize } from '../../../LocaleWrapper/LocaleWrapper';
import en_US from '../../../../locale/en_US';
import ContrastEnhancementField from '../ContrastEnhancementField/ContrastEnhancementField';
import GammaField from '../GammaField/GammaField';

const _get = require('lodash/get');
const _cloneDeep = require('lodash/cloneDeep');

// i18n
export interface ChannelFieldLocale {
  sourceChannelNameLabel: string;
  contrastEnhancementTypeLabel: string;
  gammaValueLabel: string;
}

// default props
interface ChannelFieldDefaultProps {
  locale: ChannelFieldLocale;
  contrastEnhancementTypes: ContrastEnhancement['enhancementType'][];
}

// non default props
export interface ChannelFieldProps extends Partial<ChannelFieldDefaultProps> {
  onChange?: (channel: Channel) => void;
  sourceChannelNames?: string[];
  channel?: Channel;
}

/**
 * ChannelField to select different Channel options
 */
export class ChannelField extends React.Component<ChannelFieldProps> {

  static componentName: string = 'ChannelField';

  public static defaultProps: ChannelFieldDefaultProps = {
    locale: en_US.GsChannelField,
    contrastEnhancementTypes: ['histogram', 'normalize']
  };

  updateChannel = (key: string, value: any) => {
    const {
      onChange,
      channel
    } = this.props;

    let newChannel: Channel;
    if (channel) {
      newChannel = _cloneDeep(channel);
    } else {
      newChannel = {};
    }
    newChannel[key] = value;

    if (onChange) {
      onChange(newChannel);
    }
  }

  onSourceChannelNameChange = (name: string) => {
    this.updateChannel('sourceChannelName', name);
  }

  onContrastEnhancementChange = (type: ContrastEnhancement['enhancementType']) => {
    const contrastEnhancement = _get(this.props, 'channel.contrastEnhancement');
    let newContrastEnhancement: ContrastEnhancement;
    if (contrastEnhancement) {
      newContrastEnhancement = _cloneDeep(contrastEnhancement);
    } else {
      newContrastEnhancement = {};
    }
    newContrastEnhancement.enhancementType = type;
    this.updateChannel('contrastEnhancement', newContrastEnhancement);
  }

  onGammaChange = (gamma: number) => {
    const contrastEnhancement = _get(this.props, 'channel.contrastEnhancement');
    let newContrastEnhancement: ContrastEnhancement;
    if (contrastEnhancement) {
      newContrastEnhancement = _cloneDeep(contrastEnhancement);
    } else {
      newContrastEnhancement = {};
    }
    newContrastEnhancement.gammaValue = gamma;
    this.updateChannel('contrastEnhancement', newContrastEnhancement);
  }

  render() {
    const {
      sourceChannelNames,
      channel,
      contrastEnhancementTypes,
      locale
    } = this.props;

    const sourceChannelName = _get(channel, 'sourceChannelName');
    const contrastEnhancementType = _get(channel, 'contrastEnhancement.enhancementType');
    const gamma = _get(channel, 'contrastEnhancement.gammaValue');

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    };

    return (
      <div>
        <Form.Item
          label={locale.sourceChannelNameLabel}
          {...formItemLayout}
        >
          <SourceChannelNameField
            onChange={this.onSourceChannelNameChange}
            sourceChannelName={sourceChannelName}
            sourceChannelNames={sourceChannelNames}
          />
        </Form.Item>
        <Form.Item
          label={locale.contrastEnhancementTypeLabel}
          {...formItemLayout}
        >
          <ContrastEnhancementField
            contrastEnhancement={contrastEnhancementType}
            contrastEnhancementOptions={contrastEnhancementTypes}
            onChange={this.onContrastEnhancementChange}
          />
        </Form.Item>
        <Form.Item
          label={locale.gammaValueLabel}
          {...formItemLayout}
        >
          <GammaField
            gamma={gamma}
            onChange={this.onGammaChange}
          />
        </Form.Item>
      </div>
    );
  }
}

export default localize(ChannelField, ChannelField.componentName);
