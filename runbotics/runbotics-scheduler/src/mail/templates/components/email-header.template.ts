import { logoBase } from '#/mail/assets/logo';

export const generateEmailHeader = (): string => {
  return `
    <tr>
      <td class="header">
        <img src="${logoBase}" alt="RunBotics Logo" style="max-width: 150px;" />
      </td>
    </tr>
  `;
};

