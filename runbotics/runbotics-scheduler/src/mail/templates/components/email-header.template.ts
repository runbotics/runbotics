
const logoUrl = `${process.env.RUNBOTICS_ENTRYPOINT_URL}/assets/Logo.png`;
export const generateEmailHeader = (): string => {
  return `
    <tr>
      <td class="header">
        <img src="${logoUrl}" alt="RunBotics Logo" style="max-width: 150px;" />
      </td>
    </tr>
  `;
};