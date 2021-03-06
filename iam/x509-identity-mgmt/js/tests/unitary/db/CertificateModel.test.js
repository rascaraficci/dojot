const CertificateModel = require('../../../src/db/CertificateModel');

describe("Unit tests of script 'CertificateModel.js'", () => {
  let certificateModel = null;
  let mongoClient = null;

  beforeAll(() => {
    mongoClient = {
      parseProjectionFields: jest.fn(),
      sanitizeFields: jest.fn(),
    };
    certificateModel = new CertificateModel({ mongoClient });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should parse condition fields', () => {
    const d = new Date();
    const conditionFields = {
      fingerprint: '^AB:CD',
      caFingerprint: '$AB:CD',
      createdAt: d,
    };
    const result = certificateModel.parseConditionFields(conditionFields);
    expect(result).toEqual({
      fingerprint: {
        $options: 'i',
        $regex: '^AB:CD',
      },
      caFingerprint: {
        $options: 'i',
        $regex: 'AB:CD$',
      },
      createdAt: d.toString(),
    });
  });

  it('should parse projection fields', () => {
    const commaSeparatedFields = 'validity,belongsTo';
    certificateModel.parseProjectionFields(commaSeparatedFields);
    expect(mongoClient.parseProjectionFields).toHaveBeenCalledTimes(1);
    expect(mongoClient.parseProjectionFields.mock.calls[0][0]).toBe(commaSeparatedFields);
  });

  it('this should sanitize (in depth) object attributes', () => {
    const cert = {
      fingerprint: null,
      pem: null,
    };
    certificateModel.sanitizeFields(cert);
    expect(mongoClient.sanitizeFields).toHaveBeenCalledTimes(1);
    expect(mongoClient.sanitizeFields.mock.calls[0][0]).toEqual(cert);
  });

  it('should throw an exception because it is a invalid conditional field', () => {
    const conditionFields = {
      fingerprint: { toString: null },
    };
    expect(() => {
      certificateModel.parseConditionFields(conditionFields);
    }).toThrow();
  });
});
